import { Message, PartialMessage, User } from "discord.js";
import { themeHandler, config } from "../app";
import { isThemeOn, toggleTheme } from "../events/voiceStateUpdate";
import { Command } from "../types/Command";

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
  // WARN: When repeatedly executing this command, there will be multiple message-listeners.
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
    .awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] })
    .catch(() => {
      question.edit("Request timed out.");
    });

  if (!responses) {
    return null;
  }

  const index = Number.parseInt(responses.first()!.content);
  return themeNames[index];
};

const yesSynonyms = ["yes", "y", "yee", "yeet", "put me in coach"];
const noSynonyms = ["no", "n", "nah", "nope", "stop"];

const yesNoDialogue = async (message: Message | PartialMessage, defaultValue = false) => {
  const filter = (response: Message) =>
    response.author == message.author &&
    (yesSynonyms.includes(response.content) || noSynonyms.includes(response.content));

  const responses = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
  if (responses.size < 1) return defaultValue;

  const answer = responses.first()!.content.toLowerCase();
  if (yesSynonyms.includes(answer)) return true;
  else return false;
};

const theme: Command = {
  execute: async (message, args) => {
    if (args[0] == null) {
      args[0] = "list";
    }
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
        const url = attachment.url.toLowerCase();
        const valid = config.get("supportedFiletypes").some(type => url.endsWith(type));
        if (!valid) {
          message.channel.send(`Sorry, but this filetype is currently not supported`);
          return;
        }

        const { author } = message;
        if (!author) return;

        let recipient: User;
        const mentionedUser = message.mentions.users.first();
        if (mentionedUser) {
          if (config.isAdmin(author) || mentionedUser == author) {
            recipient = mentionedUser;
          } else {
            message.channel.send("You need to be an admin to upload themes for other people.");
            return;
          }
        } else {
          recipient = author;
        }

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
        if (userConfirmation === false) {
          message.channel.send("Alright, I didn't delete it!");
          return;
        }

        await themeHandler.delete(userId, themeToDelete);
        message.channel.send(`The theme \`${themeToDelete}\` has been successfully deleted.`);
        break;

      case "list":
        try {
          const userId = message.mentions.users.size
            ? message.mentions.users.first()!.id
            : message.author!.id;
          const themeNames = await themeHandler.listThemeNames(userId);
          message.channel.send(themeNames);
        } catch (error) {
          message.channel.send("There was an error.");
        }
        break;
    }
  },
  help: {
    name: "theme",
    description: "Is used to configure and manage the user themes.",
    usage:
      "extratheme on | off | upload {*.mp3|*.wav|*.yeet}| delete [userID] {themeID|filename} | list [userID]"
  },
  config: { enabled: true, guildOnly: true }
};

module.exports = theme;
