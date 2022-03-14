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
  try {
    const path = loadDataPathFile();
    return path.data!.path; // by this point the datapath must exist
  } catch (error: any | Error) {
    return error;
  }
}

// function for updating data-path based on selection form dialogue menu
