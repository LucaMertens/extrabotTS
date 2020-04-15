import { client } from "../app";
import { ConfigHandler } from "../config/ConfigHandler";

client.on("ready", async () => {
  // const loadCommandsPromise = loadCommands();
  console.log("Extrabot is ready for some dank memes.");
  client.user!.setActivity(ConfigHandler.defaultActivity);
  // await loadCommandsPromise;
});
