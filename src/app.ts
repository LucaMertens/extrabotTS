require("dotenv").config();

// Start of bot
import { Client, Collection } from "discord.js";
import { getCommands, loadEvents } from "./utils";
import { DropboxHandler } from "./themes/DropboxHandler";
import { ThemeHandlerInterface } from "./themes/ThemeHandlerInterface";
import { Command } from "./types/Command";

export const themeHandler: ThemeHandlerInterface = new DropboxHandler();
export let commands: Collection<string, Command>;
export const client: Client = new Client();

const init = async () => {
  commands = await getCommands();
  await loadEvents();
  await client.login(process.env.TOKEN);
};

init();
