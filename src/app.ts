require("dotenv").config();

// Start of bot
import { Client, Collection, Intents } from "discord.js";
import { getCommands, loadEvents } from "./utils";
import { DropboxHandler } from "./themes/DropboxHandler";
import { ThemeHandlerInterface } from "./themes/ThemeHandlerInterface";
import { Command } from "./types/Command";
import { ConfigInterface } from "./config/ConfigInterface";
import { DynamoDBHandler } from "./config/DynamoDBConfig";
import { ObjectConfig } from "./config/ObjectConfig";

export const themeHandler: ThemeHandlerInterface = new DropboxHandler();
export const config: ConfigInterface = new ObjectConfig();
export let commands: Collection<string, Command>;
export const client: Client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

const init = async () => {
  commands = await getCommands();
  await loadEvents();
  await client.login(process.env.TOKEN);
};

init();
