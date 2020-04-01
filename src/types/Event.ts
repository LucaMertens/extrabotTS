import { ClientEvents, Client, Message, PartialMessage } from "discord.js";
export type EventName = keyof ClientEvents;

// I just copied this from Command.ts (needs review)
// I don't think having an Event-Type makes sense here, because we simply define .on methods.
export type Event = {
  // TODO: Remove client, use message.client
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
