# SUPA-SLACK

## A submission for the Supabase Launch Week 8 Hackathon

### What is Supa-Slack?

Supa-Slack is a Slack bot that let users chat with their data. It can be anything a pdf, docs file or the companies wiki
page. 

#### Installation

1. Pull down the project from GitHub
```bash
git clone git@github.com:KamaniBhavin/supa-slack.git
cd supa-slack
```

2. Start supabase local development containers
```bash
supabase start
```

3. Enable the pg_vector extension
    1. Get into the Supabase DB container and execute
    ```bash
        sudo apt update
        sudo apt install postgresql-15-pgvector
    ```

    2. Execute the init.sql file under the supabase/functions directory
    ```bash
        psql -U postgres -d postgres -f init.sql
    ```
4. Serve the functions
```bash
supabase serve
```

