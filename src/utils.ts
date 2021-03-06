import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { Command, isCommand } from "./types/Command";

export const getCommands = async (): Promise<Collection<string, Command>> => {
  const commands = new Collection<string, Command>();
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
  return commands;
};

export const loadEvents = async (): Promise<void> => {
  readdirSync(`${__dirname}/events`).forEach(fileName => {
    if (!fileName.endsWith(".js")) return;
    // This makes sure that every "client.on" - eventhandler is included.
    import("./events/" + fileName);
  });
};

export const pickRandom = (array: any[]) => array[Math.floor(Math.random() * array.length)];
