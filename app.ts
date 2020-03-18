//Start of bot
// import config from "./config";

// import * as Discord from "discord.js";
import { Client } from "discord.js";

const client: Client = new Client();

client.login(process.env.TOKEN);
let isThemeOn: boolean = true;

client.on("ready", () => {
    console.log("Extrabot is ready for some dank memes.");
    client.user?.setActivity(ConfigHandler.get("defaultActivity"));
});
client.on("disconnect", () => {
    console.warn("Disconnected!");
});

// TODO: ThemeProvider (Interface)