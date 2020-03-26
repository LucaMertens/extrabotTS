import { ClientEvents, Client, Message, PartialMessage } from "discord.js";
export type EventName = keyof ClientEvents;

// I just copied this from Command.ts (needs review)
export type Event = {
  execute(client: Client, message: Message | PartialMessage, args: string[]): Promise<void>;
  help: {
    name: string;
    description: string;
    usage: string;
  };
  config: {
    enabled: boolean;
    guildOnly: boolean;
  };
};
