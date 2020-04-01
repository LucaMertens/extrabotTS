require("dotenv").config();

// Start of bot
import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import { Command, isCommand } from "./types/Command";
import { ConfigHandler } from "./config/ConfigHandler";

export const client: Client = new Client();
export let commands: Collection<string, Command>;
export let events: Collection<string, Event>;
client.login(process.env.TOKEN);

const loadCommands = async (): Promise<void> => {
  commands = new Collection();
  readdirSync(`${__dirname}/commands`).forEach(async fileName => {
    // Ignore non-js files.
    if (!fileName.endsWith(".js")) return;
    const command = await import("./commands/" + fileName);
    if (!isCommand(command)) {
      console.log(`Skipping file ${fileName}, because it's not a command.`);
      return;
    }
    // Remove the ".js" suffix.
    const commandName = fileName.slice(0, -3);
    commands.set(commandName, command);
  });
};

const loadEvents = async (): Promise<void> => {
  readdirSync(`${__dirname}/events`).forEach(fileName => {
    if (!fileName.endsWith(".js")) return;
    // This makes sure that every "client.on" - eventhandler is included.
    import("./events/" + fileName);
  });
};

loadCommands();
loadEvents();
