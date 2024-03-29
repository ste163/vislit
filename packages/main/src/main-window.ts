import { BrowserWindow } from "electron";
import { join } from "path";
import { URL } from "url";
import type { Database } from "./database";

async function createWindow(database: Database) {
  const browserWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    title: "vislit",
    minWidth: 500,
    minHeight: 400,
    width: 1024,
    height: 768,
    backgroundColor: "#e5e5e5",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, "../../preload/dist/index.cjs"),
    },
  });

  // restore last window size and location
  const bounds = database.db.data?.windowBounds;
  if (bounds) browserWindow.setBounds(bounds);

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on("ready-to-show", () => {
    browserWindow?.show();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname
        ).toString();
  await browserWindow.loadURL(pageUrl);
  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow(database: Database) {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  if (window === undefined) window = await createWindow(database);
  if (window.isMinimized()) window.restore();
  window.focus();
  return window;
}
