import { env } from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config()

export const dataBaseConfig: Record<string, any> = {
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT || '3306', 10),
  username: env.DB_USRENAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: true,
  entities: ['dist/**/**/enities/*.entity{.ts,.js}'],
  migrations: ['dist/config/migrations/*{.ts,.js}'],
};
console.log("dataBaseConfig",dataBaseConfig);

export const  dataSource = new DataSource(dataBaseConfig as DataSourceOptions);
