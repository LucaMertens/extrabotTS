import { client, themeHandler } from "../app";

export let isThemeOn = true;

export const toggleTheme = async (): Promise<void> => {
  isThemeOn = isThemeOn ? false : true;
};

client.on("voiceStateUpdate", async (oldState, newState) => {
  const newMember = newState.member!;
  if (
    !newMember.user.bot &&
    newState.channel &&
    oldState.channel !== newState.channel &&
    newState.channel.joinable
  ) {
    const connectionPromise = newState.channel.join();
    const linkPromise = themeHandler.getRandomTheme(newMember.id);
    const connection = await connectionPromise;
    const link = await linkPromise;
    if (!link) return;

    // console.log(`Playing ${themefile.metadata.name} (User: ${newMember.user.username}).\nDelay: ${Date.now() - start}ms.`);
    connection.play(link, { volume: false, bitrate: "auto" });
  }

  if (!newState.channel && oldState.channel!.members.filter(member => !member.user.bot).size == 0) {
    oldState.channel!.leave();
  }
});
