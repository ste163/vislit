// IWindow extends Window but adds the secure ipcRenderer channels

import IProject from "@/interfaces/IProject";

export default interface IWindow extends Window {
  ipcRenderer: {
    send: (channel: string, data: unknown) => Promise<void>;
    receive: (
      channel: string,
      func: (res: boolean | IProject) => Promise<boolean | IProject>
    ) => Promise<boolean | IProject>;
  };
}
