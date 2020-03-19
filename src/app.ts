// Start of bot
import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import { Command } from "./commands/Command";

const client: Client = new Client();
declare let commands: Collection<string, Command>;
client.login(process.env.TOKEN);
let isThemeOn = true;

const loadCommands = async (): Promise<void> => {
  commands = new Collection();
  readdirSync("./commands").forEach(file => {
    const command: Command = require("./commands/" + file);
    commands.set(file, command);
  });
}

client.on("ready", async () => {
  const loadCommandsPromise = loadCommands();
  console.log("Extrabot is ready for some dank memes.");
  client.user!.setActivity(ConfigHandler.get("defaultActivity"));
  await loadCommandsPromise;
});

client.on("disconnect", () => console.warn("Disconnected!"));

client.on("message", async message => {
  if (message.author!.bot || message.content == null) return;
  const prefix = ConfigHandler.get("prefix");
  //checkForPizza();
  if (!message.content.toLowerCase().startsWith(prefix)) return;
  // Split the message at every whitespace character.
  let args = message.content.substring(prefix.length).split(/ +/g);
  let command = args.shift()!.toLowerCase();
  if (commands.has(command)) {
    commands.get(command)!.execute(message);
  } else {
    message.channel.send("WATI WAT");
  }
})