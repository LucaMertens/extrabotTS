import { Command } from "../types/Command";
import { commands } from "../app";
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
    console.log(begin);
    try {
      const stream = ytdl(link, { filter: "audioonly", begin });
      console.log(stream);
      const att = new MessageAttachment(stream, "test.mp3");
      message.channel.send(att);
    } catch (error) {
      message.channel.send("An error occured:\n```" + error.message + "```");
    }
  },
  help: {
    name: "yt",
    description: "Downloads the audio-part of a youtube-video",
    usage: "extrayt <Youtube-Link> [begin]"
  },
  config: { enabled: true, guildOnly: false }
};

module.exports = yt;
