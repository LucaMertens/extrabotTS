import { client, commands, config } from "../app";
import { Message } from "discord.js";

client.on("message", async (message: Message) => {
  if (message.author.bot || message.content == null || message.type !== "DEFAULT") return;
  // checkForPizza();
  const prefix = await config.getGlobalEntry("prefix");
  if (!message.content.toLowerCase().startsWith(prefix)) return;

  // Split the message at every whitespace character.
  const args = message.content.substring(prefix.length).split(/ +/g);

  const command = args.shift()!.toLowerCase();

  if (commands.has(command)) {
    commands.get(command)!.execute(message, args);
  } else {
    message.channel.send(
      ":regional_indicator_w: :regional_indicator_a: :regional_indicator_t: :regional_indicator_i:       :regional_indicator_w: :regional_indicator_a: :regional_indicator_t: <:kermitsip:357386809631571971> "
    );
  }
});
