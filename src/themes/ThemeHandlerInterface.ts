// import {User} from "discord.js";

interface ThemeHandlerInterface {
  /**
   * Returns the names of all themes for a user.
   * @param userId The id of the user whose themes should be listed.
   */
  listThemeNames(userId: number): Promise<string[]>;
  /**
   * Returns the specified theme as a ReadableStream.
   * @param userId The id of the user who the theme belongs to.
   * @param themeId The id of the theme that's going to be fetched.
   */
  getTheme(userId: number, themeId: number): Promise<ReadableStream>;
  /**
   * Uploads a theme file for the specified user.
   * @param userId The id of the user who the theme belongs to.
   * @param attachmentURL The URL of the attached theme file.
   */
  upload(userId: number, attachmentURL: string): Promise<boolean>;
  delete(userId: number, themeId: number): Promise<boolean>;
}
