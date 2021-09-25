// IWindow extends Window but adds the secure api channels
import IProject from "@/interfaces/IProject";

export default interface IWindow extends Window {
  api: {
    send: (channel: string, data: unknown) => Promise<unknown>;
  };
}
