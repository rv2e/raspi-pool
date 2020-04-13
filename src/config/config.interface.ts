import { IPostgresDatabaseConfig } from './postgres-database-config.interface';

export interface IConfig {
  appName: string;
  database: IPostgresDatabaseConfig;
  environment: string;
  port: number;
  release: string;
  sentryDSN?: string;
}
