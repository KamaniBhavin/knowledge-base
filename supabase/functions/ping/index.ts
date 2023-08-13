import serve = Deno.serve;

/**
 * Ping endpoint for testing.
 */
serve((req: Request) => {
    const sleep = +new URL(req.url).searchParams.get("sleep")! || 60;
    const currentTimeStamp = new Date().getTime();

    while (new Date().getTime() < currentTimeStamp + sleep * 1000) {
        /* do nothing */
    }

    const message = `Slept for ${sleep} seconds`;

    return new Response(JSON.stringify({ pong: message }), {
        headers: { "Content-Type": "application/json" },
    });
});
