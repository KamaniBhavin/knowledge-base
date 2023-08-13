# Knowledge-Base

## A submission for the Supabase Launch Week 8 Hackathon

### What is Knowledge-Base?

Knowledge-Base is a slack bot that can be used to index webpages and chat with the bot to get relevant pages based on the
message sent to the bot.

It can index complete websites using the sitemap of the website and can also index individual webpages.

It uses the pg_vector extension to create vectors of the webpage content and the user message and then uses the vectors
to find the most relevant pages. It then uses the LLM (Language Model) to generate a response based on the context and
the user message.

#### Installation

1. Pull down the project from GitHub

```bash
git clone git@github.com:KamaniBhavin/knowledge-base.git
cd knowledge-base
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

### How to use Supa-Slack?

1. Add the bot to your slack workspace
   from [here](https://slack.com/oauth/v2/authorize?client_id=4975212221364.5709859122753&scope=app_mentions:read,channels:history,users:read,users:read.email,chat:write,chat:write.public,chat:write.customize,im:history,commands&user_scope=)
2. use `/index <webpage url>` to index the webpage or `/index-site-map <sitemap url>` all the pages in the sitemap
3. To chat with the bot just send a message from the bot message section.

### How does it work?

When a user sends a site map url or a webpage url to the bot, the bot will embed the page and store it in the database.
The bot will then use the pg_vector extension to create a vector of the page content and store it in the database.
When a user sends a message to the bot, the bot will use the pg_vector extension to create a vector of the message and
compare it with the vectors of the pages in the database and return the page with the highest similarity score.

Then this relevant pages are sent to LLM (Language Model) as a context and the LLM will generate a response based on the
context and the user message. The response is then sent back to the user.

### What is the tech stack?

The bot is built using the following technologies:

1. Supabase
   a. Database (Postgres)
   b. Edge Functions (Deno)
   c. Database Webhooks
2. Slack API
3. OpenAI API (GPT-3)
4. pg_vector extension
5. LangChain.js
6. Other libraries(Eslint, Prettier, commit-lint, husky, lint-staged, typescript);

### What are the future plans?
1. Support for more file types like pdf, docs, etc.
2. Support for more chat platforms like Discord, Telegram, etc.

### Contributors
1. [Bhavin Kamani](https://github.com/KamaniBhavin)
2. [Shantanu Sardesai](https://github.com/shantanu-noovosoft)

