declare module 'node-dht-sensor' {
  export function read(
    model: number,
    pin: number,
    cb: (
      error: Error | undefined,
      temperature: number,
      humidity: number,
    ) => void,
  ): void;

  export namespace promises {
    export function read(
      model: number,
      pin: number,
    ): Promise<{ temperature: number; humidity: number }>;
  }
}

declare module 'ds18b20-raspi' {
  export function readC(
    serial: string,
    decimal: number,
    cb: (error: Error | undefined, temperature: number) => void,
  ): void;
  export function setW1Directory(path: string): void;
}
