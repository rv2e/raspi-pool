import { IPostgresDatabaseConfig } from './postgres-database-config.interface';

export interface IConfig {
  appName: string;
  database: IPostgresDatabaseConfig;
  environment: string;
  port: number;
  release: string;
  boxTemperatureSensor: { model: number; pin: number };
  waterTemperatureSensor: { deviceSerial: string; w1Directory: string };
  outsideTemperatureSensor: { deviceSerial: string; w1Directory: string };
  verticalActuators: number[][];
  poolLight: number;
  treeLight: number;
  waterPump: number;
  heatingPump: number;
  sentryDSN?: string;
}
