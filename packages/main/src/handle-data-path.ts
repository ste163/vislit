import { app } from "electron";
import { JSONFileSync, LowSync, MemorySync } from "lowdb";

interface DataPath {
  path: string;
}

function loadDataPathFile(): LowSync<DataPath> {
  // NOTE: if there's no way to automate the test; remove the MemorySync
  const adapter =
    process.env.NODE_ENV === "test"
      ? new MemorySync<DataPath>() // in-memory test database
      : new JSONFileSync<DataPath>(
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
    const throwError = () => {
      throw new Error("Unable to load or create vislit data path");
    };
    return path.data?.path ? path.data.path : throwError();
  } catch (error: any | Error) {
    return error;
  }
}

// function for updating data-path based on selection form dialogue menu
