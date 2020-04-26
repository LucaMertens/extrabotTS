/* eslint-disable require-jsdoc */
import { ConfigInterface, GuildConfig, GlobalConfig, UserConfig } from "./ConfigInterface";
import { config, DynamoDB } from "aws-sdk";
import { Guild, User } from "discord.js";

class DynamoDBHandler implements ConfigInterface {
  private docClient: DynamoDB.DocumentClient;
  private TABLE_NAME = "Extrabot-Config";
  private HASH_KEY = "type:id";
  private SORT_KEY = "key";

  constructor(token: string) {
    config.update({ region: "us-east-1" });
    this.docClient = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
  }

  getGlobalEntry<K extends keyof GlobalConfig>(property: K): GlobalConfig[K] {
    let value: GlobalConfig[K];
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.TABLE_NAME,
      Key: {
        [this.HASH_KEY]: "global",
        [this.SORT_KEY]: property
      },
      ProjectionExpression: "value"
    };

    this.docClient.get(params, (err, data) => {
      console.log(data);
      value = data.Item.value;
    });
    return value;
  }

  getGuildEntry<K extends keyof GuildConfig>(guild: Guild, property: K): GuildConfig[K] {
    let value: GuildConfig[K];
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.TABLE_NAME,
      Key: {
        [this.HASH_KEY]: "guild:" + guild.id,
        key: property
      },
      ProjectionExpression: "value"
    };

    this.docClient.get(params, (err, data) => {
      console.log(data);
      value = data.Item.value;
    });
    return value;
  }

  getUserEntry<K extends keyof UserConfig>(user: User, property: K): UserConfig[K] {
    let value: UserConfig[K];
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.TABLE_NAME,
      Key: {
        [this.HASH_KEY]: "user:" + user.id,
        key: property
      },
      ProjectionExpression: "value"
    };

    this.docClient.get(params, (err, data) => {
      console.log(data);
      value = data.Item.value;
    });
    return value;
  }

  setGlobalEntry<K extends keyof GlobalConfig>(key: K, value: GlobalConfig[K]): boolean {
    const params = {
      TableName: this.TABLE_NAME,
      Item: { [this.HASH_KEY]: "global", key, value }
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
      Item: { [this.HASH_KEY]: `guild:${guild.id}`, key, value }
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
      Item: { [this.HASH_KEY]: `user:${user.id}`, key, value }
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

  isAdmin(guild: Guild, userId: string): boolean {
    if (this.getGlobalEntry("botOwners").some(botOwner => botOwner.id == userId)) return true;
    if (!guild) return;
    return this.getGuildEntry(guild, "admins").some(admin => admin.id == userId);
  }
}
