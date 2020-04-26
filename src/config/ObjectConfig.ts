// /* eslint-disable require-jsdoc */
// import { ConfigInterface } from "./ConfigInterface";
// import { User } from "discord.js";

// export class ObjectConfig implements ConfigInterface {
//   // TODO: Work on a real Config implementation, not using hard-coded js objects
//   private config: ConfigShape = {
//     prefix: "extra",
//     defaultActivity: { name: "the sanic theme", type: "LISTENING" },
//     admins: [
//       { name: "Extramurloc", id: "181805681349754880" },
//       { name: "XDawanX", id: "178585123707420674" },
//       { name: "Cowgummi", id: "138545227299422208" }
//     ],
//     supportedFiletypes: ["mp3", "wav", "yeet"],
//     pizzaTimes: [
//       {
//         embed: {
//           title: "**Pizza Time**",
//           image: {
//             url:
//               "https://media1.tenor.com/images/fea58eb4616ff8ff041906bc5ddf9023/tenor.gif?itemid=10424139"
//           },
//           author: {
//             name: "Peter Parker",
//             iconURL: "http://pm1.narvii.com/6517/5e4bacc110f5d63bd9254d1d0b47304ddbde1569_00.jpg"
//           },
//           color: 15964934
//         }
//       },
//       {
//         embed: {
//           title: "**Pizza Time**",
//           image: {
//             url: "https://i.redd.it/quoifauecklz.gif"
//           },
//           author: {
//             name: "Peter Parker",
//             iconURL:
//               "https://img.diply.com/article-images/a/7ecf2a94-cb06-47ef-b8c2-d23374845273.png"
//           },
//           color: 15964934
//         }
//       }
//     ]
//   };

//   get<K extends keyof ConfigShape>(property: K): ConfigShape[K] {
//     return this.config[property];
//   }

//   set<K extends keyof ConfigShape>(property: K, value: ConfigShape[K]): boolean {
//     this.config[property] = value;
//     return true;
//   }

//   isAdmin(userOrId: string | User): boolean {
//     const userId = userOrId instanceof User ? userOrId.id : userOrId;
//     return this.get("admins").some(admin => admin.id == userId);
//   }
// }
