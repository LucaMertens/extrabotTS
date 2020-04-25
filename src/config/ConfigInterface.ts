import { ActivityOptions, MessageEmbedOptions, User } from "discord.js";

type PizzaTime = {
  embed: MessageEmbedOptions;
};

export type ConfigShape = {
  prefix: string;
  defaultActivity: ActivityOptions;
  admins: {
    name: string;
    id: string;
  }[];
  supportedFiletypes: string[];
  pizzaTimes: PizzaTime[];
};

/**
 * An Interface to get and set config data (independent of where that config is actually stored).
 */
export interface ConfigInterface {
  /**
   * Returns the config-entry (value) for the given property (key).
   * @param property The key to retrieve the value for.
   * @return The value for the provided key.
   */
  get<K extends keyof ConfigShape>(property: K): ConfigShape[K];
  /**
   * Sets Values inside the config
   * @param property Config field where to insert value
   * @param value Value to insert at given property
   * @return true, if the value was successfully set, else false.
   */
  set<K extends keyof ConfigShape>(property: K, value: ConfigShape[K]): boolean;
  /**
   * Checks if a user is an admin
   * @param userOrId The User object or ID
   * @return {boolean} returns boolean value
   */
  isAdmin(userOrId: string | User): boolean;
}
