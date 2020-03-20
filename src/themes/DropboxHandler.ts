import { Dropbox } from "dropbox";
import * as isomorphicFetch from "isomorphic-fetch";

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
    DropboxTypes;
  }

  /* eslint-disable-next-line require-jsdoc */
  async listThemeNames(userId: number): Promise<string[]> {
    const path = "/themes/" + userId;
    const { entries } = await this.dropbox.filesListFolder({ path });

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
  getTheme(userId: number, themeId: number): Promise<ReadableStream<any>> {
    throw new Error("Method not implemented.");
  }
  /* eslint-disable-next-line require-jsdoc */
  upload(userId: number, attachmentURL: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  /* eslint-disable-next-line require-jsdoc */
  delete(userId: number, themeId: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
