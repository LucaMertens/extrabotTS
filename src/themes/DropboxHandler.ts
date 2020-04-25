import { Dropbox } from "dropbox";
import * as isomorphicFetch from "isomorphic-fetch";
import { ThemeHandlerInterface, Playable } from "./ThemeHandlerInterface";
import { pickRandom } from "../utils";
import { MessageAttachment, Snowflake } from "discord.js";

// TODO: remove require-jsdoc overrides

/**
 * Provides access to themes stored on a Dropbox-Account.
 */
export class DropboxHandler implements ThemeHandlerInterface {
  private dropbox: Dropbox;
  /** Initializes the connection to Dropbox via their API. */
  constructor() {
    this.dropbox = new Dropbox({
      fetch: isomorphicFetch,
      accessToken: process.env.DROPBOXTOKEN
    });
  }

  /** Returns the correct path for a user-directory or a specific theme within that directory.
   * Themes are grouped by userId, so all themes for a user with the Id 123 will be located in the folder "/themes/123".
   * @param userId The Discord-UserId of the user who the theme belongs to.
   * @param themeName The name of the theme, including its file-ending. When omitted, the function will simply return a user-directory.
   * @return A path to be used with the Dropbox-API.
   */

  private static getPath = (userId: Snowflake, themeName = "") => `/themes/${userId}/${themeName}`;

  /* eslint-disable-next-line require-jsdoc */
  async listThemeNames(userId: Snowflake): Promise<string[]> {
    const path = DropboxHandler.getPath(userId);
    const { entries } = await this.dropbox.filesListFolder({ path });
    // TODO: Handling a non-existent user.

    // eslint-disable-next-line prefer-const
    let names: string[] = [];
    entries.forEach(element => {
      if (element[".tag"] == "file") {
        names.push(element.name);
      }
    });

    return names;
  }

  /* eslint-disable-next-line require-jsdoc */
  async getTheme(userId: Snowflake, themeName: string): Promise<Playable> {
    const path = DropboxHandler.getPath(userId, themeName);
    // This will throw an error if the file doesn't exist.
    // TODO: Define Errors in interface.
    const { link } = await this.dropbox.filesGetTemporaryLink({ path });
    return link;
  }

  /* eslint-disable-next-line require-jsdoc */
  async getRandomTheme(userId: Snowflake): Promise<Playable> {
    const names = await this.listThemeNames(userId);
    if (names.length <= 0) {
      throw new Error("No theme found for the user.");
    }
    const themeName = pickRandom(names);
    const path = DropboxHandler.getPath(userId, themeName);

    const { link } = await this.dropbox.filesGetTemporaryLink({ path });
    return link;
  }

  // /* eslint-disable-next-line require-jsdoc */
  // async __uploadOld(
  //   userId: Snowflake,
  //   themeName: string,
  //   themeBody: Object | ReadableStream<any>
  // ): Promise<boolean> {
  //   const path = DropboxHandler.getPath(userId, themeName);
  //   await this.dropbox.filesUpload({
  //     path,
  //     contents: themeBody,
  //     mode: { ".tag": "overwrite" }
  //   });
  //   return true;
  // }

  /* eslint-disable-next-line require-jsdoc */
  async upload(userId: Snowflake, attachment: MessageAttachment): Promise<boolean> {
    const path = DropboxHandler.getPath(userId, attachment.name);

    await this.dropbox.filesSaveUrl({ path, url: attachment.url });
    return true;
  }

  /* eslint-disable-next-line require-jsdoc */
  async delete(userId: Snowflake, themeName: string): Promise<boolean> {
    const path = DropboxHandler.getPath(userId, themeName);
    try {
      await this.dropbox.filesDeleteV2({ path });
      return true;
    } catch (error) {
      return false;
    }
  }
}
