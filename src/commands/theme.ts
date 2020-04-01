import { Command } from "../types/Command";
import { isThemeOn, toggleTheme } from "../events/voiceStateUpdate";
import { ConfigHandler } from "../config/ConfigHandler";
import { User } from "discord.js";
import { DropboxHandler } from "../themes/DropboxHandler";

const theme: Command = {
  execute: async (message, args) => {
    switch (args[0]) {
      case "on":
        isThemeOn ? null : toggleTheme();
        break;
      case "off":
        isThemeOn ? toggleTheme() : null;
        break;
      case "upload": // TODO: Error handling!
        if (message.attachments.size == 0) {
          message.channel.send("M8, you forgot the attachment");
          return;
        }
        const attachment = message.attachments.first()!;
        const filetype = attachment.url
          .split(".")
          .pop()
          ?.toLowerCase();

        if (!ConfigHandler.get("supportedFiletypes").includes(filetype)) {
          message.channel.send(`Sorry, this filetype (${filetype}) is currently not supported`);
          return;
        }
        let recipient: User;
        if (message.mentions.users.first()) {
          if (
            ConfigHandler.checkAdmin(message.author!.id) ||
            message.mentions.users.first()!.id == message.author!.id
          ) {
            recipient = message.mentions.users.first()!;
          } else {
            message.channel.send(
              "You need to be an admin in order to upload themes for other sad people that are sad."
            );
            return;
          }
        } else {
          recipient = message.author!;
        }

        // TODO: Shared DropboxHandler-Object
        new DropboxHandler().upload(parseInt(recipient.id), attachment);
        message.channel.send(
          `The theme \`\`\`${attachment.name}\`\`\` has been uploaded for the user ${recipient}`
        );
        break;
      case "delete":
        // TODO: extratheme delete
        break;
      case "list":
        const dropboxHandler = new DropboxHandler();
        try {
          message.mentions.users.first()
            ? dropboxHandler.listThemeNames(parseInt(message.mentions.users.first()!.id))
            : dropboxHandler.listThemeNames(parseInt(message.author!.id));
        } catch (error) {
          message.channel.send(error.name);
        }
        break;
    }
  },
  help: {
    name: "theme",
    description: "Is used to configure and manage the user themes",
    usage:
      "extratheme on | off | upload {*.mp3|*.wav|*.yeet}| delete [userID] {themeID|filename} | list [userID]"
  },
  config: { enabled: true, guildOnly: true }
};

module.exports = theme;
