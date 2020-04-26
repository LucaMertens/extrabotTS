import { ActivityOptions, MessageEmbedOptions, User, Guild } from "discord.js";

type PizzaTime = {
  embed: MessageEmbedOptions;
};

// export type ConfigShape = {
//   global: {};
//   local: {};
// };

export type GlobalConfig = {
  prefix: string;
  supportedFiletypes: string[];
  pizzaTimes: PizzaTime[];
  defaultActivity: ActivityOptions;
  botOwners: {
    name: string;
    id: string;
  }[];
};

export type GuildConfig = {
  admins: {
    name: string;
    id: string;
  }[];
};

export type UserConfig = {
  isThemeOn: boolean;
};

/**
 * An Interface to get and set config data (independent of where that config is actually stored).
 */
export interface ConfigInterface {
  /**
   * Returns the global config-entry (value) for the given property (key).
   * @param property The key to retrieve the value for.
   * @return The value for the provided key.
   */
  getGlobalEntry<K extends keyof GlobalConfig>(property: K): GlobalConfig[K];
  /**
   * Returns the guild-specific config-entry (value) for the given property (key).
   * @param guild The guild to retrieve the configuration for.
   * @param property The key to retrieve the value for.
   * @return The value for the provided key.
   */
  getGuildEntry<K extends keyof GuildConfig>(guild: Guild, property: K): GuildConfig[K];
  /**
   * Returns the user-specific config-entry (value) for the given property (key).
   * @param user The user to retrieve the configuration for.
   * @param property The key to retrieve the value for.
   * @return The value for the provided key.
   */
  getUserEntry<K extends keyof UserConfig>(user: User, property: K): UserConfig[K];
  /**
   * Sets Values inside the global config.
   * @param property Config field where to insert value.
   * @param value Value to insert at given property.
   * @return true, if the value was successfully set, else false.
   */
  setGlobalEntry<K extends keyof GlobalConfig>(key: K, value: GlobalConfig[K]): boolean;
  /**
   * Sets Values inside the guild config.
   * @param key Config field where to insert value.
   * @param value Value to insert at given property.
   * @return true, if the value was successfully set, else false.
   */
  setGuildEntry<K extends keyof GuildConfig>(guild: Guild, key: K, value: GuildConfig[K]): boolean;
  /**
   * Sets Values inside the user config.
   * @param user The user to insert a config value for.
   * @param key Config field where to insert value.
   * @param value Value to insert at given property.
   * @return true, if the value was successfully set, else false.
   */
  setUserEntry<K extends keyof UserConfig>(user: User, key: K, value: UserConfig[K]): boolean;
  /**
   * Checks if a user is an admin.
   * @param guild The guild to check the admin status for.
   * @param userOrId The User ID.
   * @return {boolean} a boolean value representing whether the user is an admin in the guild.
   */
  isAdmin(guild: Guild, userId: string): boolean;
}
