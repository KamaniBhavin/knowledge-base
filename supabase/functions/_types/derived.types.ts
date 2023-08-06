import { Database } from "./generated.types.ts";

export type SlackTeamToken = Database["public"]["Tables"]["slack_team_tokens"];

export type EmbeddedDocument = Database["public"]["Tables"]["documents"]["Row"];
