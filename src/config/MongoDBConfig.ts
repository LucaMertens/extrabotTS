/* eslint-disable require-jsdoc */
import { ConfigInterface, GuildConfig, GlobalConfig, UserConfig } from "./ConfigInterface";
import { config, DynamoDB } from "aws-sdk";
import { Guild, User } from "discord.js";

export class MongoDBConfig implements ConfigInterface {
  constructor() {}
  getGlobalEntry<K extends keyof GlobalConfig>(property: K): Promise<GlobalConfig[K]> {
    throw new Error("Method not implemented.");
  }
  getGuildEntry<K extends keyof GuildConfig>(guild: Guild, property: K): Promise<GuildConfig[K]> {
    throw new Error("Method not implemented.");
  }
  getUserEntry<K extends keyof UserConfig>(user: User, property: K): Promise<UserConfig[K]> {
    throw new Error("Method not implemented.");
  }
  setGlobalEntry<K extends keyof GlobalConfig>(key: K, value: GlobalConfig[K]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  setGuildEntry<K extends keyof GuildConfig>(
    guild: Guild,
    key: K,
    value: GuildConfig[K]
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  setUserEntry<K extends keyof UserConfig>(
    user: User,
    key: K,
    value: UserConfig[K]
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  isAdmin(guild: Guild, userId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
