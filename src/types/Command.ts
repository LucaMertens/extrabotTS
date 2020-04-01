import { Message, PartialMessage } from "discord.js";
export type Command = {
  execute(message: Message | PartialMessage, args: string[]): Promise<void>;
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

// TODO: Replace with ts is<> library.
export const isCommand = (object: any): object is Command =>
    !!object.execute /* && !!object.help && !!object.config */;