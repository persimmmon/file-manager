import fs, { createReadStream } from "fs";
import os from "os";
import zlib from "zlib";
import { createHash } from "crypto";

import { OPERATION_FAILED } from "./constants.js";

export const isExist = async (cwd) => {
  try {
    fs.access(cwd);
    return true;
  } catch (e) {
    return false;
  }
};

export const printList = async (cwd) => {
  fs.readdir(cwd, { withFileTypes: true }, (e, files) => {
    if (e) {
      console.log(OPERATION_FAILED);
    } else {
      const res = [];

      files
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => a.isFile() - b.isFile())
        .forEach((file) => {
          res.push({
            Name: file.name,
            Type: file.isDirectory() ? "directory" : "file",
          });
        });

      console.table(res);
    }
  });
};

export const catFile = async (cwd) => {
  try {
    await isExist(cwd);
    fs.createReadStream(cwd).pipe(process.stdout);
  } catch (e) {
    console.log(OPERATION_FAILED);
  }
};

export const addFile = async (cwd) => {
  fs.writeFile(cwd, "", (err) => {
    if (err) {
      console.log(OPERATION_FAILED);
    }
  });
};

export const renameFile = async (prev, curr) => {
  try {
    await isExist(prev);
    fs.rename(prev, curr, (err) => {
      if (err) {
        console.log(OPERATION_FAILED);
      }
    });
  } catch (e) {
    console.log(OPERATION_FAILED);
  }
};

export const copyFile = async (from, to) => {
  try {
    await isExist(from);
    const readable = createReadStream(from);
    const writable = fs.createWriteStream(to);
    readable.pipe(writable);
  } catch (e) {
    console.log(OPERATION_FAILED);
  }
};

export const removeFile = async (cwd) => {
  try {
    await isExist(cwd);
    fs.unlink(cwd, (err) => {
      if (err) {
        console.log(OPERATION_FAILED);
      }
    });
  } catch (e) {
    console.log(OPERATION_FAILED);
  }
};

export const moveFile = async (from, to) => {
  await copyFile(from, to);
  await removeFile(from);
};

export const info = (arg) => {
  switch (arg) {
    case "--eol":
      console.log(JSON.stringify(os.EOL));
      break;
    case "--cpus":
      console.table(
        os.cpus().map((el) => ({
          Model: el.model,
          Rate: el.speed / 1000 + "GHz",
        }))
      );
      break;
    case "--homedir":
      console.log(os.homedir());
    case "--username":
      console.log(os.userInfo().username);
    case "--architecure":
      console.log(process.arch);
  }
};

export const hashFile = async (cwd) => {
  try {
    await isExist(cwd);
    fs.readFile(cwd, "utf-8", (err, data) => {
      if (err) {
        console.log(OPERATION_FAILED);
      } else {
        const hash = createHash("sha256").update(data).digest("hex");
        console.log(hash);
      }
    });
  } catch (e) {
    console.log(OPERATION_FAILED);
  }
};

export const compressFile = async (from, to) => {
  try {
    await isExist(from);
    const zip = zlib.createGzip();

    const read = fs.createReadStream(from);
    const write = fs.createWriteStream(to);

    read.pipe(zip).pipe(write);
  } catch (e) {
    console.log(OPERATION_FAILED);
  }
};

export const decompressFile = async (from, to) => {
  try {
    await isExist(from);
    const unzip = zlib.createUnzip();

    const read = fs.createReadStream(from);
    const write = fs.createWriteStream(to);

    read.pipe(unzip).pipe(write);
  } catch (e) {
    console.log(OPERATION_FAILED);
  }
};
