import fs, { createReadStream } from "fs";
import { OPERATION_FAILED, INVALID_INPUT } from "./constants.js";

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
