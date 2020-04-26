/* eslint-disable require-jsdoc */
import { ConfigInterface, GuildConfig, GlobalConfig, UserConfig } from "./ConfigInterface";
import { config, DynamoDB } from "aws-sdk";
import { Guild, User } from "discord.js";

export class DynamoDBHandler implements ConfigInterface {
  private docClient: DynamoDB.DocumentClient;
  private TABLE_NAME = "Extrabot-Config";
  private HASH_KEY = "type:id";
  private SORT_KEY = "key";

  constructor() {
    config.update({ region: "us-east-1" });
    this.docClient = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
  }

  async getGlobalEntry<K extends keyof GlobalConfig>(property: K): Promise<GlobalConfig[K]> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.TABLE_NAME,
      Key: {
        [this.HASH_KEY]: "global",
        [this.SORT_KEY]: property
      },
      ProjectionExpression: "value"
    };

    const { Item } = await this.docClient.get(params).promise();
    if (Item == undefined) {
      throw new Error("yeet");
    }

    return Item.value;
  }

  async getGuildEntry<K extends keyof GuildConfig>(
    guild: Guild,
    property: K
  ): Promise<GuildConfig[K]> {
    let value: GuildConfig[K];
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.TABLE_NAME,
      Key: {
        [this.HASH_KEY]: "guild:" + guild.id,
        [this.SORT_KEY]: property
      },
      ProjectionExpression: "value"
    };

    const { Item } = await this.docClient.get(params).promise();
    if (Item == undefined) {
      throw new Error("yeet");
    }

    return Item.value;
  }

  async getUserEntry<K extends keyof UserConfig>(user: User, property: K): Promise<UserConfig[K]> {
    let value: UserConfig[K];
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.TABLE_NAME,
      Key: {
        [this.HASH_KEY]: "user:" + user.id,
        [this.SORT_KEY]: property
      },
      ProjectionExpression: "value"
    };

    const { Item } = await this.docClient.get(params).promise();
    if (Item == undefined) {
      throw new Error("yeet");
    }

    return Item.value;
  }

  setGlobalEntry<K extends keyof GlobalConfig>(key: K, value: GlobalConfig[K]): boolean {
    const params = {
      TableName: this.TABLE_NAME,
      Item: { [this.HASH_KEY]: "global", [this.SORT_KEY]: key, value }
    };

    this.docClient.put(params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        return true;
      }
    });
    return false;
  }

  setGuildEntry<K extends keyof GuildConfig>(guild: Guild, key: K, value: GuildConfig[K]): boolean {
    const params = {
      TableName: this.TABLE_NAME,
      Item: { [this.HASH_KEY]: `guild:${guild.id}`, [this.SORT_KEY]: key, value }
    };

    this.docClient.put(params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        return true;
      }
    });
    return false;
  }

  setUserEntry<K extends keyof UserConfig>(user: User, key: K, value: UserConfig[K]): boolean {
    const params = {
      TableName: this.TABLE_NAME,
      Item: { [this.HASH_KEY]: `user:${user.id}`, [this.SORT_KEY]: key, value }
    };

    this.docClient.put(params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        return true;
      }
    });
    return false;
  }

  async isAdmin(guild: Guild, userId: string): Promise<boolean> {
    const botOwners = await this.getGlobalEntry("botOwners");
    if (botOwners.some(botOwner => botOwner.id == userId)) return true;

    if (!guild) return false;

    const admins = await this.getGuildEntry(guild, "admins");
    return admins.some(admin => admin.id == userId);
  }
}
