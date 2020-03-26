import { Command } from "./Command";
import { isThemeOn, toggleTheme } from "../events/voiceStateUpdate";
import { ConfigHandler } from "../config/ConfigHandler";
import { User } from "discord.js";
import { client } from "../app";
import { DropboxHandler } from "../themes/DropboxHandler";

const theme: Command = {
  execute: async (client, message, args) => {
    switch (args[0]) {
      case "on":
        isThemeOn ? null : toggleTheme();
        break;
      case "off":
        isThemeOn ? toggleTheme() : null;
        break;
      case "upload": // Error handling?
        if (message.attachments.size == 0) {
          message.channel.send("M8, you forgot the attachment");
          break;
        }
        const attachment = message.attachments.first()!;
        const filetype = attachment.url
          .split(".")
          .pop()
          ?.toLowerCase();
        console.log(attachment);
        if (!ConfigHandler.get("supportedFiletypes").includes(filetype)) {
          message.channel.send(
            `Sorry, this filetype (${filetype}) is currently not supported`
          );
          break;
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
              "You need to be an admin in order to upload themes for other people."
            );
            return;
          }
        } else {
          recipient = message.author!;
        }
        fetch(attachment.url).then(data => {
          new DropboxHandler().upload(
            parseInt(recipient.id),
            attachment.name!,
            data.body!
          );
          message.channel.send(
            `The theme \`\`\`${attachment.name}\`\`\` has been uploaded for the user ${recipient}`
          );
        });
        break;
      case "delete":
        // TODO: extratheme delete
        break;
      case "list":
        const dropboxHandler = new DropboxHandler();
        message.mentions.users.first()
          ? dropboxHandler.listThemeNames(
              parseInt(message.mentions.users.first()!.id)
            )
          : dropboxHandler.listThemeNames(parseInt(message.author!.id));
        // readability ruined by Prettier?
        break;
    }
  },
  help: {
    name: "theme",
    description: "Is used to configure and manage the user themes",
    usage:
      "extratheme on | off | upload {*.mp3|*.wav|*.yeet}| delete [userID] {themeID|filename} | list [userID]"
  },
  config: { enabled: true, guildOnly: false }
};

exports.default = theme;
