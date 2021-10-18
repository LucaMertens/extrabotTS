import { Command } from "../types/Command";

// TODO: better error handling than console.log()
const inspire: Command = {
  config: { enabled: true, guildOnly: false },
  execute: async (message, args) => {
    fetch("http://inspirobot.me/api?generate=true")
      .then(response => response.text())
      .then(text => message.channel.send(text))
      .catch(err => {
        console.log(err);
        message.channel.send("🦀Zenyatta is gone🦀");
      });
  },
  help: {
    name: "inspire",
    description: "Used to get inspired by inspirational quotes",
    usage: "extrainspire",
  },
};

module.exports = inspire;
