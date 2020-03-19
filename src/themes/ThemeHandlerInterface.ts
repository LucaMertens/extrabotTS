interface ThemeHandlerInterface {
  /**
   * Returns the names of all themes for a user.
   * @param userId Whose themes should be listed.
   */
  listThemeNames(userId: number): string[];
  /**
   * Returns a direct (media-) link to the specified theme.
   * @param userId The id of the user who "owns" the theme.
   * @param themeId The id of the theme that's going to be fetched.
   */
  getThemeLink(userId: number, themeId: number): string;
  upload(userId: number, attachmentURL: string): boolean;
  delete(userId: number, themeId: number): boolean;
}

