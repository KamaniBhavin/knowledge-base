import serve = Deno.serve;
import { ISlackEvent, ISlackUrlVerificationEvent } from "../_shared/types.ts";

serve(async (req) => {
    const event: ISlackEvent = await req.json();

    if (!event) {
        return new Response(JSON.stringify({ error: "No event provided" }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    // Url verification event to capture events from slack
    if (event.type === "url_verification") {
        const { challenge } = event as ISlackUrlVerificationEvent;
        return Response.json({ challenge });
    }

    return new Response(null);
});
