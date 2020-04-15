import { client, commands } from "../app";
import { ConfigHandler } from "../config/ConfigHandler";

client.on("message", async message => {
  if (message.author!.bot || message.content == null) return;
  const prefix = ConfigHandler.prefix;
  // checkForPizza();
  if (!message.content.toLowerCase().startsWith(prefix)) return;
  // Split the message at every whitespace character.
  const args = message.content.substring(prefix.length).split(/ +/g);

  const command = args.shift()!.toLowerCase();

  if (commands.has(command)) {
    commands.get(command)!.execute(message, args);
  } else {
    message.channel.send("WATI WAT");
  }
});
