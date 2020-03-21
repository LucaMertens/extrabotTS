import { Message, PartialMessage } from "discord.js";
export interface Command {
  execute(message: Message | PartialMessage): Promise<void>;
  help(): string;
}
