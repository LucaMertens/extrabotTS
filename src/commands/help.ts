import { Command } from "./Command";

const help: Command = {
  execute: async (client, message, args) => {},
  help: { name: "help", description: "helps", usage: "help pls" },
  config: { enabled: false, guildOnly: false }
};

exports.default = help;
