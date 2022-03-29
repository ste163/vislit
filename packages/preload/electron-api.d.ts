declare interface Window {
  api: {
    send: (channel: string, data?: unknown) => Promise<unknown>;
    receive: (channel: string, func?: unknown) => Promise<unknown>;
  };
  electronRequire?: NodeRequire;
}
