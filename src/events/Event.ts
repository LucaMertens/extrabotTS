export type EventName = "ready" | "voiceStateUpdate" | "disconnect" | "message";

// I just copied this from Command.ts (needs review)
export type Event = {
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
