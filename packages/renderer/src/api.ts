async function send(channel: string, data?: any): Promise<any> {
  return await window.api.send(channel, data);
}

export default send;
