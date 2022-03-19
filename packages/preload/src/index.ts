// Securely exposes IPC to the renderer. This is the only way
// for the renderer to communicate with the main process.
// for more info: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
import { contextBridge, ipcRenderer } from "electron";

// whitelist channels
const validChannels = [
  "dialog-fetch-error",
  "dialog-data-link-non-taskbar",
  "dialog-change-save-location",
  "projects-get-all",
  "projects-add",
  "projects-update",
  "projects-delete",
  "types-get-all",
  "types-add",
  "types-delete",
  "goals-add",
  "goals-update",
  "goals-delete",
  "goals-completed",
  "progress-get-all-by-year-month",
  "progress-get-by-date",
  "progress-modify",
  "writer-get-most-recent",
  "notes-get-all-by-project-id",
  "notes-get-by-id",
  "notes-add",
  "notes-update",
  "notes-delete",
  "html-save",
];

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: async (channel: string, data: unknown): Promise<unknown> => {
    if (validChannels.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
  },
  receive: (channel: string, func: any): void => {
    if (channel === "reload-database") {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
