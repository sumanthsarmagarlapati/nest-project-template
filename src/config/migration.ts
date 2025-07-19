import { env } from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from'dotenv';
dotenv.config();

const dataBaseConfig: Record<string, any> = {
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || '2001', 10),
    username: env.DB_USRENAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    synchronize: true,
    entities: ['dist/**/**/entities/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
};

export const dataSource = new DataSource(dataBaseConfig as DataSourceOptions);
