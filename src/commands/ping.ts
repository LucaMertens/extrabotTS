import { Command } from "../types/Command";

const ping: Command = {
  execute: async (message, args) => {
    message.reply("Pong!");
  },
  help: {
    name: "ping",
    description: "Used to check whether Extrabot is responding.",
    usage: "extraping",
  },
  config: { enabled: true, guildOnly: false },
};

module.exports = ping;
