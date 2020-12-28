/* eslint-disable require-jsdoc */
import { ConfigInterface, GlobalConfig, GuildConfig, UserConfig } from "./ConfigInterface";
import { User, Guild } from "discord.js";
export class ObjectConfig implements ConfigInterface {
  async getGlobalEntry<
    K extends "prefix" | "supportedFiletypes" | "pizzaTimes" | "defaultActivity" | "botOwners"
  >(property: K): Promise<GlobalConfig[K]> {
    return this.globalConfig[property];
  }
  async getGuildEntry<K extends "admins">(guild: Guild, property: K): Promise<GuildConfig[K]> {
    throw new Error("Method not implemented.");
  }
  async getUserEntry<K extends "isThemeOn">(user: User, property: K): Promise<UserConfig[K]> {
    throw new Error("Method not implemented.");
  }
  async setGlobalEntry<
    K extends "prefix" | "supportedFiletypes" | "pizzaTimes" | "defaultActivity" | "botOwners"
  >(key: K, value: GlobalConfig[K]): Promise<boolean> {
    this.globalConfig[key] = value;
    return true;
  }
  async setGuildEntry<K extends "admins">(
    guild: Guild,
    key: K,
    value: GuildConfig[K]
  ): Promise<boolean> {
    throw new Error("Method not implemented."); // :(
  }
  async setUserEntry<K extends "isThemeOn">(
    user: User,
    key: K,
    value: UserConfig[K]
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async isAdmin(guild: Guild, userId: string): Promise<boolean> {
    const botOwners = await this.getGlobalEntry("botOwners");
    return botOwners.some(admin => admin.id === userId);
  }

  // TODO: Work on a real Config implementation, not using hard-coded js objects
  private globalConfig: GlobalConfig = {
    prefix: "extra",
    defaultActivity: { name: "the sanic theme", type: "LISTENING" },
    supportedFiletypes: ["mp3", "wav", "yeet"],
    botOwners: [
      { name: "Extramurloc", id: "181805681349754880" },
      { name: "XDawanX", id: "178585123707420674" }
    ],
    pizzaTimes: [
      {
        embed: {
          title: "**Pizza Time**",
          image: {
            url:
              "https://media1.tenor.com/images/fea58eb4616ff8ff041906bc5ddf9023/tenor.gif?itemid=10424139"
          },
          author: {
            name: "Peter Parker",
            iconURL: "http://pm1.narvii.com/6517/5e4bacc110f5d63bd9254d1d0b47304ddbde1569_00.jpg"
          },
          color: 15964934
        }
      },
      {
        embed: {
          title: "**Pizza Time**",
          image: {
            url: "https://i.redd.it/quoifauecklz.gif"
          },
          author: {
            name: "Peter Parker",
            iconURL:
              "https://img.diply.com/article-images/a/7ecf2a94-cb06-47ef-b8c2-d23374845273.png"
          },
          color: 15964934
        }
      }
    ]
  };

  private guildConfig: GuildConfig = {
    admins: []
  };
}
