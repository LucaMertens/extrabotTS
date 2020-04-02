import { VoiceBroadcast, MessageAttachment, Snowflake } from "discord.js";

export type Playable = ReadableStream | VoiceBroadcast | string;
type themeResult = {
  success: boolean;
  errorMessage?: string;
  errorObject?: Error;
};

export interface ThemeHandlerInterface {
  /**
   * Returns the names of all themes for a user.
   * @param userId The id of the user whose themes should be listed.
   */
  listThemeNames(userId: Snowflake): Promise<string[]>;
  /**
   * Returns the specified theme.
   * @param userId The id of the user who the theme belongs to.
   * @param themeName The name of the theme that's going to be fetched.
   * @returns An object that can be played by DiscordJs' VoiceConnection.play().
   */
  getTheme(userId: Snowflake, themeName: string): Promise<Playable>;
  /**
   * Returns a random theme chosen from all of the users themes.
   * @param userId The id of the user who the theme belongs to.
   * @returns An object that can be played by DiscordJs' VoiceConnection.play().
   */
  getRandomTheme(userId: Snowflake): Promise<Playable>;
  /**
   * Saves a file located at the given Url as a theme.
   * @param userId The id of the user who the theme belongs to.
   * @param attachment The theme as a Discord-Attachment.
   * @returns Resolves to true if the upload was successful.
   */
  upload(userId: Snowflake, attachment: MessageAttachment): Promise<boolean>;
  /**
   * Deletes a theme file for the specified user.
   * @param userId The id of the user who the theme belongs to.
   * @param themeName The name of the theme that's going to be fetched.
   */
  delete(userId: Snowflake, themeName: string): Promise<boolean>;
}
