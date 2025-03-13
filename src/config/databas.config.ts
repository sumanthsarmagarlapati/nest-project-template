import { env } from 'process';
import { DataSource } from 'typeorm';

const dataBaseConfig: Record<string, any> = {
  type: env.DATABASE_TYPE,
  host: env.DATABASE_HOST,
  port: parseInt(env.DATABASE_PORT || '2001', 10),
  username: env.DATABSE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABSE,
  synchronize: true,
  entities: ['../../**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
};

export const dataSource = new DataSource(dataBaseConfig);
