export interface IPostgresDatabaseConfig {
  database: string;
  host: string;
  password: string;
  port: number;
  type: 'postgres';
  username: string;
}
