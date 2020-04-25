import { client, config } from "../app";

client.on("ready", async () => {
  // const loadCommandsPromise = loadCommands();
  console.log("Extrabot is ready for some dank memes.");
  client.user!.setActivity(config.get("defaultActivity"));
  // await loadCommandsPromise;
});
