export let isThemeOn = true;

export const toggleTheme = async (): Promise<void> => {
  isThemeOn = isThemeOn ? false : true;
};
