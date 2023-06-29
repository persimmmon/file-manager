import { App } from "./app.js";

const username =
  process.argv
    ?.find((el) => el.includes("--username="))
    ?.replace("--username=", "") || "Unknown";

console.log(`Welcome to the File Manager, ${username}!`);

process.on("exit", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});

const app = new App(process.cwd());
await app.start();
