// import { ClientEvents, Client, Message, PartialMessage } from "discord.js";
// export type EventName = keyof ClientEvents;

// // I just copied this from Command.ts (needs review)
// // I don't think having an Event-Type makes sense here, because we simply define .on methods.
// export type Event = {
//   // TODO: Remove Type entirely. (Done)
//   execute(client: Client, message: Message | PartialMessage, args: string[]): Promise<void>;
//   help: {
//     name: string;
//     description: string;
//     usage: string;
//   };
//   config: {
//     enabled: boolean;
//     guildOnly: boolean;
//   };
// };

// Commented out, will probably be removed in next Session
// (unnecessary, especially because we will never use help or config and because it would be a lot of pain to implement it that way)
