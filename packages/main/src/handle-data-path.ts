import { app } from "electron";
import { JSONFileSync, LowSync } from "lowdb";

interface DataPath {
  path: string;
}

function loadDataPathFile(): LowSync<DataPath> {
  const adapter = new JSONFileSync<DataPath>(
    `${app.getPath("userData")}/vislit-data-path.json`
  );
  const dataPath = new LowSync<DataPath>(adapter);
  dataPath.read();
  // If no data in file, create initial data
  if (!dataPath.data) {
    dataPath.data = {
      path: `${app.getPath("userData")}/vislit-data`,
    };
    dataPath.write();
  }
  return dataPath;
}

export function getDataPath(): string | Error {
  // TODO: this should not load the datapath
  // it should ONLY get
  // so that we can read from anywhere
  // then we can have a set/write
  // to write from anywhere
  // -> that means that in index.ts
  // we save the return value of dataPath
  // so that lowdb never gets garbage collected
  // then we set/get from the 2 methods
  // |
  // POTENTIAL PROBLEM:
  // get/set must reference the correct instance, so we may need to create a class
  // that gets passed into the dialogs (which may also need to be a class)
  try {
    const path = loadDataPathFile();
    return path.data!.path; // by this point the datapath must exist
  } catch (error: any | Error) {
    return error;
  }
}

// function for updating data-path based on selection form dialogue menu
