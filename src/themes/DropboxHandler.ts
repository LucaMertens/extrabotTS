import { Dropbox } from "dropbox";
import * as isomorphicFetch from "isomorphic-fetch";

class DropboxHandler implements ThemeHandlerInterface {
  declare dropbox: Dropbox;

  constructor() {
    this.dropbox = new Dropbox({
      fetch: isomorphicFetch,
      accessToken: process.env.DROPBOXTOKEN
    });
  }

  listThemeNames(userId: number): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  getTheme(userId: number, themeId: number): Promise<ReadableStream<any>> {
    throw new Error("Method not implemented.");
  }
  upload(userId: number, attachmentURL: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(userId: number, themeId: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
