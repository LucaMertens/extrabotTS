import { client } from "../app";

client.on("disconnect", () => console.warn("Disconnected!"));
