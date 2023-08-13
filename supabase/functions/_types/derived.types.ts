/** Wrapper types on top of the generated types to make them easier to use */
import { Database } from "./generated.types.ts";

export type SlackTeamToken = Database["public"]["Tables"]["slack_team_tokens"];

export type Document = Database["public"]["Tables"]["documents"];

export type Crawler = Database["public"]["Tables"]["crawlers"];

export type SlackQAChat = Database["public"]["Tables"]["slack_qa_chats"];

export type CrawlerInsertEvent = {
    type: "INSERT";
    table: "crawlers";
    record: Crawler["Row"];
    schema: "public";
    old_record: null;
};

export type SlackQAChatInsertEvent = {
    type: "INSERT";
    table: "slack_qa_chats";
    record: SlackQAChat["Row"];
    schema: "public";
    old_record: null;
};
