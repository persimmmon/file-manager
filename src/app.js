import { createInterface } from "readline/promises";
import path from "path";

import { OPERATION_FAILED, INVALID_INPUT } from "./constants.js";

import {
  isExist,
  printList,
  catFile,
  addFile,
  renameFile,
  copyFile,
  moveFile,
  removeFile,
} from "./utils.js";

export class App {
  constructor(cwd) {
    this._cwd = cwd;
  }

  correctInput(command, args) {
    switch (command) {
      case "up":
      case "ls":
        if (args.length === 0) {
          return true;
        }
      case "cat":
      case "add":
      case "cd":
      case "rm":
        if (args.length === 1) {
          return true;
        }
      case "rn":
      case "cp":
      case "mv":
        if (args.length === 2) {
          return true;
        }
      default:
        return false;
    }
  }

  async up() {
    const cwd = path.resolve(this._cwd, "..");
    try {
      await isExist(cwd);
      this._cwd = cwd;
    } catch (e) {
      console.log(OPERATION_FAILED);
    }
  }

  async cd([dir]) {
    const cwd = path.resolve(this._cwd, dir);
    try {
      await isExist(cwd);
      this._cwd = cwd;
    } catch (e) {
      console.log(OPERATION_FAILED);
    }
  }

  async ls() {
    await printList(this._cwd);
  }

  async cat([file]) {
    const cwd = path.resolve(this._cwd, file);
    await catFile(cwd);
  }

  async add([name]) {
    const cwd = path.resolve(this._cwd, name);
    await addFile(cwd);
  }

  async rn([prev, curr]) {
    await renameFile(
      path.resolve(this._cwd, prev),
      path.resolve(this._cwd, curr)
    );
  }

  async cp([from, to]) {
    await copyFile(path.resolve(this._cwd, from), path.resolve(this._cwd, to));
  }

  async mv([from, to]) {
    await moveFile(path.resolve(this._cwd, from), path.resolve(this._cwd, to));
  }

  async rm([name]) {
    await removeFile(path.resolve(this._cwd, name));
  }

  async start() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    while (true) {
      const input = await rl.question(`You are currently in ${this._cwd}\n`);
      const command = input.split(" ")[0];
      const args = input.split(" ").slice(1);
      if (this.correctInput(command, args)) {
        try {
          await this[command](args);
        } catch (e) {
          console.log(OPERATION_FAILED);
        }
      } else {
        console.log(INVALID_INPUT);
      }
    }
  }
}
