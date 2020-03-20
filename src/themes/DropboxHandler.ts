import { Dropbox } from "dropbox";
import * as isomorphicFetch from "isomorphic-fetch";
import { ThemeHandlerInterface, Playable } from "./ThemeHandlerInterface";
import { pickRandom } from "../utils";

/**
 * Provides access to themes stored on a Dropbox-Account.
 */
export class DropboxHandler implements ThemeHandlerInterface {
  private declare dropbox: Dropbox;
  /** Initializes the connection to Drobox via their API. */
  constructor() {
    this.dropbox = new Dropbox({
      fetch: isomorphicFetch,
      accessToken: process.env.DROPBOXTOKEN
    });
  }

  private static getPath = (userId: number, themeName = "") =>
    `/themes/${userId}/${themeName}`;

  /* eslint-disable-next-line require-jsdoc */
  async listThemeNames(userId: number): Promise<string[]> {
    const path = DropboxHandler.getPath(userId);
    const { entries } = await this.dropbox.filesListFolder({ path });
    // TODO: Handling a non-existant user.

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
  async getTheme(userId: number, themeName: string): Promise<Playable> {
    const path = DropboxHandler.getPath(userId, themeName);
    // This will throw an error if the file doesn't exist.
    // TODO: Define Errors in interface.
    const { link } = await this.dropbox.filesGetTemporaryLink({ path });

    return link;
  }

  /* eslint-disable-next-line require-jsdoc */
  async getRandomTheme(userId: number): Promise<Playable> {
    const names = await this.listThemeNames(userId);
    if (names.length <= 0) {
      throw new Error("No theme found for the user.");
    }

    const themeName = pickRandom(names);
    const path = DropboxHandler.getPath(userId, themeName);

    const { link } = await this.dropbox.filesGetTemporaryLink({ path });
    return link;
  }

  /* eslint-disable-next-line require-jsdoc */
  async upload(userId: number, attachmentURL: string): Promise<boolean> {
    const path = DropboxHandler.getPath(userId);
    this.dropbox.filesUpload({
      path,
      contents: "test",
      mode: { ".tag": "overwrite" }
    });
    throw new Error("Method not implemented.");
  }

  /* eslint-disable-next-line require-jsdoc */
  async saveURL(userId: number, attachmentURL: string): Promise<boolean> {
    await this.dropbox.filesSaveUrl({ path: "test", url: attachmentURL });
    return true;
  }

  /* eslint-disable-next-line require-jsdoc */
  async delete(userId: number, themeName: string): Promise<boolean> {
    const path = DropboxHandler.getPath(userId, themeName);
    try {
      this.dropbox.filesDeleteV2({ path });
    } catch (error) {
      return false;
    }

    return true;
  }
}
