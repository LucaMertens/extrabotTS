import { Command } from "../types/Command";
import { commands } from "../app";

const help: Command = {
  execute: async (message, args) => {
    let outputMessage = "";
    commands.forEach(command => {
      outputMessage += "```\n";
      const { help } = command;
      outputMessage += `${help.name}
      ${help.description}
      Usage: ${help.usage}`;

      outputMessage += "```";
    });

    message.channel.send(outputMessage);
  },
  help: { name: "help", description: "helps", usage: "help pls" },
  config: { enabled: true, guildOnly: false }
};

module.exports = help;
