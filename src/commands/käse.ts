import { Command } from "../types/Command";
import { client, config } from "../app";

// TODO: better error handling than console.error()
const käse: Command = {
  execute: async (message, args) => {
    const voiceChannel = message.member!.voice.channel;
    if (voiceChannel) {
      message.channel.send("🧀🧀 Operation  *K Ä S E*   is a go 🧀🧀");
      client.user!.setActivity("the Käse-Song", { type: "LISTENING" });
      voiceChannel
        .join()
        .then(connection => {
          const dispatcher = connection.play(
            // TODO: Use other type of Link
            "https://cdn.glitch.com/38dd0611-f9f8-451e-b5b4-8b630a644a8e%2FK%C3%A4se-Song.mp3"
          );
          dispatcher.setVolume(2);
          dispatcher.on("close", async () => {
            client.user!.setActivity(await config.getGlobalEntry("defaultActivity"));
          });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      message.channel.send("You need to be in a :b:oicechannel for this command.");
    }
  },
  help: {
    name: "käse",
    description: "Used to launch operation Käse",
    usage: "extrakäse"
  },
  config: { enabled: true, guildOnly: true }
};

module.exports = käse;
