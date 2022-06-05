import { Command } from "../types/Command";
import ytdl = require("ytdl-core");
import { MessageAttachment } from "discord.js";

const yt: Command = {
  execute: async (message, args) => {
    const link = args[0];
    if (link == null || !ytdl.validateURL(link)) {
      message.channel.send("No valid Youtube-Link specified.");
      return;
    }
    const begin = args[1];
    try {
      const stream = ytdl(link, { filter: "audioonly", begin });
      console.log(stream);
      const att = new MessageAttachment(stream, "test.mp3");
      message.channel.send(att);
    } catch (e) {
      if (e instanceof Error) {
        message.channel.send(`The following error occurred:\n\`\`\`${e.message}\`\`\``);
      }
    }
  },
  help: {
    name: "yt",
    description: "Downloads the audio-part of a Youtube-video",
    usage: "extrayt <Youtube-Link> [begin]",
  },
  config: { enabled: true, guildOnly: false },
};

module.exports = yt;
