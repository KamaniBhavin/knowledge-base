-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store documents
create table documents
(
    id        bigserial primary key,
    content   text,
    metadata  jsonb,
    embedding vector(1536)
);

-- Create a function to search for documents
create or replace function search_documents(
    query_embedding vector(1536),
    match_count int DEFAULT null,
    filter jsonb DEFAULT '{}'
)
    returns table
            (
                id         bigint,
                content    text,
                metadata   jsonb,
                similarity float
            )
    language plpgsql
as
$$
begin
    return query
        select id,
               content,
               metadata,
               1 - (documents.embedding <=> query_embedding) as similarity
        from documents
        where metadata @> filter
        order by documents.embedding <=> query_embedding
        limit match_count;
end;
$$;

-- https://supabase.com/docs/guides/functions/schedule-functions
create extension pg_cron; -- to start non-site-map crawlers
create extension pg_net; -- to schedule/start-up edge functions

create type url_document_type as enum ('XML', 'HTML', 'PDF');

create table crawlers
(
    id                bigserial primary key,
    url               varchar                 not null,
    url_document_type url_document_type       not null,
    created_at        timestamp default now() not null,
    scheduled_at      timestamp,
    started_at        timestamp,
    crawled_at        timestamp,
    failed_at         timestamp,
    priority          int                     not null -- higher the number higher the priority
);

create or replace function start_crawler(crawler_id bigint)
    returns void
    language plpgsql
as
$$
begin
    perform
        net.http_post(
                url := 'https://oikrsbhdyfttguchaogp.functions.supabase.co/functions/v1/crawler',
                headers :='{
                  "Content-Type": "application/json"
                }'::jsonb,
                body := json_build_object('crawlerId', crawler_id)
            ) as request_id;

    update crawlers c
    set scheduled_at = now()
    where c.id = crawler_id;
end;
$$;

-- database trigger on `url_document_type` column, when a new `XML` document type comes, a new crawler starts.
create or replace trigger init_site_map_crawler
    after insert
    on crawlers
    when ( url_document_type = 'XML' )
execute function start_crawler(crawler_id := id);

select cron.schedule(
               schedule := '*/5 * * * *',
               command := $$
        -- assuming only 1 crawler
        with crawl_next as (select c.id
                            from crawlers c
                            where not exists(select 1
                                             from crawlers c
                                             where c.scheduled_at is not null
                                               and (c.started_at is null
                                                    or c.crawled_at is null
                                                    or c.failed_at is null))
                              and c.scheduled_at is null
                              and c.started_at is null
                              and c.crawled_at is null
                              and c.failed_at is null
                              and c.url_document_type != 'XML'
                            order by c.priority desc
                            limit 1)
        select start_crawler(crawler_id := cn.id)
        from crawl_next cn;
    $$
           );
