require("dotenv").config();

// Start of bot
import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import { getCommands } from "./getCommands";
import { DropboxHandler } from "./themes/DropboxHandler";
import { ThemeHandlerInterface } from "./themes/ThemeHandlerInterface";
import { Command } from "./types/Command";

export const themeHandler: ThemeHandlerInterface = new DropboxHandler();
export let commands: Collection<string, Command>;
export const client: Client = new Client();

const loadEvents = async (): Promise<void> => {
  readdirSync(`${__dirname}/events`).forEach(fileName => {
    if (!fileName.endsWith(".js")) return;
    // This makes sure that every "client.on" - eventhandler is included.
    import("./events/" + fileName);
  });
};

const init = async () => {
  commands = await getCommands();
  await loadEvents();
  await client.login(process.env.TOKEN);
};

init();
