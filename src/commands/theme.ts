import { Command } from "../types/Command";
import { isThemeOn, toggleTheme } from "../events/voiceStateUpdate";
import { ConfigHandler } from "../config/ConfigHandler";
import { User, Message, PartialMessage } from "discord.js";
import { DropboxHandler } from "../themes/DropboxHandler";
import { ThemeHandlerInterface } from "../themes/ThemeHandlerInterface";
// TODO: Auslagern
const themeHandler: ThemeHandlerInterface = new DropboxHandler();

const getNumberedThemelist = (nameArray: string[]) => {
  let result = "";
  nameArray.forEach((name, index) => {
    result += `${index}: ${name}` + "\n";
  });
  return result;
};

const themeChooserDialogue = async (
  message: Message | PartialMessage,
  themeNames: string[],
  text: string
): Promise<string | null> => {
  // TODO: When repeatedly executing this command, there will be multiple message-listeners.
  // TODO: Option to cancel.
  const list = getNumberedThemelist(themeNames);
  const question = await message.channel.send(text + "\n" + list);

  const filter = (response: Message) => {
    if (response.author == message.author && response.content.match(/^[0-9]+$/)) {
      const index = Number.parseInt(response.content);
      return index >= 0 && index < themeNames.length;
    }
    return false;
  };

  const responses = await question.channel
    .awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
    .catch(() => {
      question.edit("Request timed out.");
    });

  if (!responses) {
    return null;
  }

  const index = Number.parseInt(responses.first()!.content);
  return themeNames[index];
};

/* const yesSynonyms = ["yes", "y", "yee", "yeet"];
const noSynonyms = ["no", "n", "nah", "nope", "stop"]; */

const yesNoDialogue = async (message: Message | PartialMessage, defaultValue = false) => {
  const filter = (response: Message) =>
    response.author == message.author && /^(y|n)$/i.test(response.content);

  const responses = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
  if (responses.size < 1) return defaultValue;

  const answer = responses.first()!.content.toLowerCase();
  if (answer == "y") return true;
  else return false;
};

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
            message.channel.send("You need to be an admin to upload themes for other people.");
            return;
          }
        } else {
          recipient = message.author!;
        }

        // TODO: Shared DropboxHandler-Object
        themeHandler.upload(recipient.id, attachment);
        message.channel.send(
          `The theme \`\`\`${attachment.name}\`\`\` has been uploaded for the user ${recipient}`
        );
        break;
      case "delete":
        const userId = message.author!.id;
        const themeNames = await themeHandler.listThemeNames(userId);
        let themeToDelete: string | null;

        if (args[1] == null) {
          const dialogueText = "Please enter the number of the theme you'd like to delete.";
          themeToDelete = await themeChooserDialogue(message, themeNames, dialogueText);
        } else {
          const matches = themeNames.filter(name => name.startsWith(args[1]));

          switch (matches.length) {
            case 0: {
              const dialogueText =
                "No match found. Please enter the number of the theme you'd like to delete.";
              themeToDelete = await themeChooserDialogue(message, themeNames, dialogueText);
              break;
            }
            case 1: {
              themeToDelete = matches[0];
              break;
            }
            default: {
              const dialogueText =
                "The following themes match your search. Which of them would you like to delete?";
              themeToDelete = await themeChooserDialogue(message, matches, dialogueText);
              break;
            }
          }
        }

        if (themeToDelete == null) return;
        message.channel.send(
          "The file `" + themeToDelete + "` will be yeeted out of existence. Is that ok?\nY/N"
        );
        const userConfirmation = await yesNoDialogue(message);
        if (userConfirmation == false) {
          message.channel.send("Alrigth, I didn't delete it!");
          return;
        }

        await themeHandler.delete(userId, themeToDelete);
        message.channel.send(`The theme \`${themeToDelete}\` has been successfully deleted.`);
        break;
      case "list":
        try {
          const themeNames = message.mentions.users.first()
            ? themeHandler.listThemeNames(message.mentions.users.first()!.id)
            : themeHandler.listThemeNames(message.author!.id);
          message.channel.send(themeNames);
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
