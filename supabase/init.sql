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

-- supported docs
create type url_document_type as enum ('XML', 'HTML', 'PDF');

-- a function to start edge function crawling
create or replace function start_crawler(crawler_id bigint)
    returns void
    language plpgsql
as
$$
begin
    perform
        net.http_get(
                url := 'https://oikrsbhdyfttguchaogp.functions.supabase.co/functions/v1/crawler?crawlerId=' ||
                       crawler_id,
                headers :='{
                  "Content-Type": "application/json"
                }'::jsonb
            ) as request_id;

    update crawlers c
    set scheduled_at = now()
    where c.id = crawler_id;
end;
$$;

-- A cron job that embeds all the urls that are dropped
select cron.schedule(
               'crawl',
               schedule := '*/3 * * * *',
               command := $$
        -- assuming only 1 crawler
        with crawl_next as (select c.id
                    from crawlers c
                    where c.crawled_at is null
                      and c.failed_at is null
                    order by c.priority desc
                    limit 1)
        select start_crawler(crawler_id := cn.id)
        from crawl_next cn
            $$
           );
