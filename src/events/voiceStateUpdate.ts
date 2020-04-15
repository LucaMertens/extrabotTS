// import { client } from "../app";

export let isThemeOn = true;

export const toggleTheme = async (): Promise<void> => {
  isThemeOn = isThemeOn ? false : true;
};

// client.on("voiceStateUpdate", async (oldState, newState) => {

// }
