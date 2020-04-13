declare module 'node-dht-sensor' {
  export namespace promises {
    export function read(
      model: number,
      pin: number,
    ): Promise<{ temperature: number; humidity: number }>;
  }
}
