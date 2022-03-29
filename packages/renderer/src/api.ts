export async function send(channel: string, data?: any): Promise<any> {
  return await window.api?.send(channel, data);
}

export function receive(channel: string, func: any): void {
  window.api?.receive(channel, func);
}
