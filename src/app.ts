require("dotenv").config();

// Start of bot
import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import { Command } from "./commands/Command";
import { EventName } from "./events/Event";
import { ConfigHandler } from "./config/ConfigHandler";

export const client: Client = new Client();
export let commands: Collection<string, Command>;
export let events: Collection<string, Event>;
client.login(process.env.TOKEN);

const loadCommands = async (): Promise<void> => {
  commands = new Collection();
  readdirSync("./src/commands").forEach(file => {
    const command: Command = require("./commands/" + file);
    commands.set(file, command);
  });
};

const loadEvents = async (): Promise<void> => {
  readdirSync("./src/events").forEach(file => {
    const event = require("./events/" + file);
    const eventName: EventName = file.split(".")[0] as EventName;
    client.on(eventName, event);
  });
};

loadCommands();
loadEvents();

client.on("ready", async () => {
  const loadCommandsPromise = loadCommands();
  console.log("Extrabot is ready for some dank memes.");
  client.user!.setActivity(ConfigHandler.get("defaultActivity"));
  await loadCommandsPromise;
});

// client.on("disconnect", () => console.warn("Disconnected!"));

// client.on("message", async message => {
//   if (message.author!.bot || message.content == null) return;
//   const prefix = ConfigHandler.get("prefix");
//   // checkForPizza();
//   if (!message.content.toLowerCase().startsWith(prefix)) return;
//   // Split the message at every whitespace character.
//   const args = message.content.substring(prefix.length).split(/ +/g);

//   const command = args.shift()!.toLowerCase();
//   if (commands.has(command)) {
//     commands.get(command)!.execute(message);
//   } else {
//     message.channel.send("WATI WAT");
//   }
// });
