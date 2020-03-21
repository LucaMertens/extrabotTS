import { Client, Message, PartialMessage } from "discord.js";
export type Command = {
  execute(
    client: Client,
    message: Message | PartialMessage,
    args: string[]
  ): Promise<void>;
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
