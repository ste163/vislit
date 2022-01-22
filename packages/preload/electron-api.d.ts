declare interface Window {
  api: {
    send: (channel: string, data?: unknown) => Promise<unknown>;
  };
  electronRequire?: NodeRequire;
}
