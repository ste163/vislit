// Securely exposes IPC to the renderer. This is the only way
// for the renderer to communicate with the main process.
// for more info: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel: string, data: unknown) => {
    // whitelist channels
    const validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: async (channel: string, func) => {
    const validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, async (event, ...args) => await func(...args));
    }
  },
});
