// TODO: v Replace this v
/* eslint-disable require-jsdoc */
import { ActivityOptions, MessageEmbedOptions } from "discord.js";

interface PizzaTime {
  embed: MessageEmbedOptions;
}

type ConfigShape = {
  prefix: string;
  defaultActivity: ActivityOptions;
  admins: {
    name: string;
    id: string;
  }[];
  supportedFiletypes: string[];
  pizzaTimes: PizzaTime[];
};

type test = keyof ConfigShape;

export class ConfigHandler {
  // TODO: Replace this hacky mess.
  private static config: ConfigShape = {
    prefix: "extra",
    defaultActivity: { name: "the sanic theme", type: "LISTENING" },
    admins: [
      { name: "Extramurloc", id: "181805681349754880" },
      { name: "XDawanX", id: "178585123707420674" },
      { name: "Cowgummi", id: "138545227299422208" }
    ],
    supportedFiletypes: ["mp3", "wav", "yeet"],
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

  // F extends ConfigHandler[T, infer R] ? R : any
  // infer?
  // static get(property: keyof ConfigShape) {
  //   return ConfigHandler.config[property];
  // }

  static get prefix() {
    return ConfigHandler.config.prefix;
  }
  static get defaultActivity() {
    return ConfigHandler.config.defaultActivity;
  }
  static get admins() {
    return ConfigHandler.config.admins;
  }
  static get supportedFiletypes() {
    return ConfigHandler.config.supportedFiletypes;
  }
  static get pizzaTimes() {
    return ConfigHandler.config.pizzaTimes;
  }

  static set(property: keyof ConfigShape, value: any): boolean {
    ConfigHandler.config[property] = value;
    return true;
  }

  static checkAdmin = (userID: string) =>
    ConfigHandler.admins.some((user: { id: string; [key: string]: any }) => user.id == userID);
}
