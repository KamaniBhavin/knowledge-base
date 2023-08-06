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
