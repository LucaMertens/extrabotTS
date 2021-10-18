import { Message, PartialMessage, User } from "discord.js";
import { themeHandler, config } from "../app";
import { isThemeOn, toggleTheme } from "../events/voiceStateUpdate";
import { Command } from "../types/Command";

const getNumberedThemelist = (nameArray: string[]) => {
  let result = "```\n";
  nameArray.forEach((name, index) => {
    result += `${index}: ${name}` + "\n";
  });
  result += "```";
  return result;
};

const themeChooserDialogue = async (
  message: Message,
  themeNames: string[],
  text: string
): Promise<string | null> => {
  // WARN: When repeatedly executing this command, there will be multiple message-listeners.
  // TODO: Option to cancel.
  const list = getNumberedThemelist(themeNames);
  const question = await message.channel.send(text + "\n" + list);

  const filterThemeIndex = (response: Message) => {
    if (response.author === message.author && response.content.match(/^[0-9]+$/)) {
      const themeIndex = Number.parseInt(response.content);
      return themeIndex >= 0 && themeIndex < themeNames.length;
    }
    return false;
  };

  const responses = await question.channel
    .awaitMessages(filterThemeIndex, { max: 1, time: 10000, errors: ["time"] })
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
    response.author === message.author &&
    (yesSynonyms.includes(response.content) || noSynonyms.includes(response.content));

  const responses = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
  if (responses.size < 1) return defaultValue;

  const answer = responses.first()!.content.toLowerCase();
  return yesSynonyms.includes(answer);
};

/**
 * Determines who's the user targeted by the specified message (command).
 * @param message The command as a Discord-Message.
 * @returns {User} The targeted user.
 */
const determineTarget = (message: Message): User => {
  const { author, guild } = message;

  if (guild == null || message.mentions.users.size === 0) {
    return author;
  } else {
    return message.mentions.users.first()!;
  }
};

/**
 * List all themes of the user mentioned in the message. If no user is specified, list all of the authors themes.
 * @param message The command as a Discord-Message.
 * @returns {void}
 */
async function handleList(message: Message): Promise<void> {
  const target = determineTarget(message);
  const themeNames = await themeHandler.listThemeNames(target.id);
  message.channel.send(getNumberedThemelist(themeNames));
}

/**
 * Uploads a theme attached in the message.
 *
 * @param message A Discord message containing an audio file as an attachment.
 * If that's not the case, an error message is sent and nothing is uploaded.
 * @returns {void}
 */
async function handleUpload(message: Message): Promise<void> {
  if (message.attachments.size === 0) {
    message.channel.send("M8, you forgot the attachment");
    return;
  }

  const target = determineTarget(message);
  // A user needs to be an admin on the guild to upload themes for other people.
  const { guild, author } = message;
  if (target !== author && !config.isAdmin(guild!, author.id)) {
    message.channel.send("You need to be an admin to do that.");
    return;
  }

  const attachment = message.attachments.first()!;
  const url = attachment.url.toLowerCase();
  const supportedFiletypes = await config.getGlobalEntry("supportedFiletypes");
  const isFiletypeValid = supportedFiletypes.some(type => url.endsWith(type));

  if (!isFiletypeValid) {
    message.channel.send(`Sorry, but this filetype is currently not supported`);
    return;
  }

  themeHandler.upload(target.id, attachment);
  message.channel.send(
    `The theme \`\`\`${attachment.name}\`\`\` has been uploaded for the user ${target}`
  );
}

/**
 * If the query-string matches the start of a theme: delete it;
 * otherwise ask the user to choose a theme to delete.
 * @param message The command as a Discord-Message.
 * @param query A prefix to search for (eg. in `extratheme delete dank`, "dank" would be the query matching the themes `dank`, `dankmemes` etc.)
 * @returns {void}
 */
async function handleDelete(message: Message, query: string | null): Promise<void> {
  const target = determineTarget(message);

  const { guild, author } = message;
  if (target !== author && !config.isAdmin(guild!, author.id)) {
    message.channel.send("You need to be an admin to do that.");
    return;
  }

  const themeNames = await themeHandler.listThemeNames(target.id);
  let themeToDelete: string | null;

  if (query == null) {
    const dialogueText = "Please enter the number of the theme you'd like to delete.";
    themeToDelete = await themeChooserDialogue(message, themeNames, dialogueText);
  } else {
    const matches = themeNames.filter(name => name.startsWith(query));

    switch (matches.length) {
      case 0: {
        message.channel.send("No match found.");
        // Ask the user to choose the theme from a list.
        handleDelete(message, null);
        return;
      }
      case 1: {
        themeToDelete = matches[0];
        break;
      }
      default: {
        // We have more than one matching theme.
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
  const isGoTime = await yesNoDialogue(message);
  if (!isGoTime) {
    message.channel.send("Alright, I didn't delete it!");
    return;
  }

  await themeHandler.delete(target.id, themeToDelete);
  message.channel.send(`The theme \`${themeToDelete}\` has been successfully deleted.`);
}

/**
 * Handles a theme command (eg. `extratheme list`).
 * @param message The message invoking the command.
 * @param args The arguments for the command.
 * @returns {void}
 */
async function handleThemeCommand(message: Message, args: string[]): Promise<void> {
  let commandType = args[0];
  if (commandType == null) {
    commandType = "list";
  }

  switch (commandType) {
    case "list":
      await handleList(message);
      break;

    case "on":
      if (!isThemeOn) toggleTheme();
      break;

    case "off":
      if (isThemeOn) toggleTheme();
      break;

    case "upload": {
      await handleUpload(message);
      break;
    }

    case "delete": {
      await handleDelete(message, args[1]);
      break;
    }
    default: {
      message.channel.send(`Usage:\n\`${theme.help.usage}\``);
    }
  }
}

const theme: Command = {
  help: {
    name: "theme",
    description: "Is used to configure and manage user themes.",
    usage:
      "extratheme on | off | upload {*.mp3|*.wav|*.yeet}| delete [userID] {themePrefix} | list [userID]",
  },
  config: { enabled: true, guildOnly: false },

  execute: async (message, args) => {
    try {
      await handleThemeCommand(message, args);
    } catch (error) {
      message.channel.send(`The following error occurred:\n\`\`\`${error.message}\`\`\``);
    }
  },
};

module.exports = theme;
