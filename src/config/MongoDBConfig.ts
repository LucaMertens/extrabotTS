// /* eslint-disable require-jsdoc */
// import { ConfigInterface, GuildConfig, GlobalConfig, UserConfig } from "./ConfigInterface";
// import { config, DynamoDB } from "aws-sdk";
// import { Guild, User } from "discord.js";
// import { MongoClient, Db } from "mongodb";

// export class MongoDBConfig implements ConfigInterface {
//   url = "mongodb://mongo-db:27017/";
//   dbClient: MongoClient;
//   database: Promise<Db>;

//   constructor() {
//     this.dbClient = new MongoClient(this.url);
//     this.database = this.getDatabasePromise();
//   }

//   async getDatabasePromise(): Promise<Db> {
//     await this.dbClient.connect();
//     return this.dbClient.db("database");
//   }

//   async getGlobalEntry<K extends keyof GlobalConfig>(property: K): Promise<GlobalConfig[K]> {
//     throw new Error("Method not implemented.");
//   }
//   async getGuildEntry<K extends keyof GuildConfig>(
//     guild: Guild,
//     property: K
//   ): Promise<GuildConfig[K]> {
//     const database = await this.database;
//     const collection = database.collection("guilds");
//   }
//   async getUserEntry<K extends keyof UserConfig>(user: User, property: K): Promise<UserConfig[K]> {
//     const database = await this.database;
//     throw new Error("Method not implemented.");
//   }
//   async setGlobalEntry<K extends keyof GlobalConfig>(
//     key: K,
//     value: GlobalConfig[K]
//   ): Promise<boolean> {
//     throw new Error("Method not implemented.");
//   }
//   async setGuildEntry<K extends keyof GuildConfig>(
//     guild: Guild,
//     key: K,
//     value: GuildConfig[K]
//   ): Promise<boolean> {
//     const database = await this.database;
//     throw new Error("Method not implemented.");
//   }
//   async setUserEntry<K extends keyof UserConfig>(
//     user: User,
//     key: K,
//     value: UserConfig[K]
//   ): Promise<boolean> {
//     const database = await this.database;
//     throw new Error("Method not implemented.");
//   }
//   async isAdmin(guild: Guild, userId: string): Promise<boolean> {
//     const database = await this.database;
//     throw new Error("Method not implemented.");
//   }
// }
