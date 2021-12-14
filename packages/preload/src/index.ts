// Securely exposes IPC to the renderer. This is the only way
// for the renderer to communicate with the main process.
// for more info: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
import { contextBridge, ipcRenderer } from "electron";

// whitelist channels
const validChannels = [
  "projects-get-all",
  "projects-add",
  "projects-update",
  "projects-delete",
  "writer-save",
];

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: async (channel: string, data: unknown): Promise<unknown> => {
    if (validChannels.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
  },
});
