import { Command } from "../types/Command";

// TODO: better error handling than console.log()
const inspire: Command = {
  execute: async (message, args) => {
    fetch("http://inspirobot.me/api?generate=true")
      .then(response => {
        return response.text();
      })
      .then(text => {
        message.channel.send(text);
      })
      .catch(err => {
        console.log(err);
        message.channel.send("🦀Zenyatta is gone🦀");
      });
  },
  help: {
    name: "inspire",
    description: "Use it to get inspired by inspirational quotes",
    usage: "extrainspire"
  },
  config: { enabled: true, guildOnly: false }
};

module.exports = inspire;
