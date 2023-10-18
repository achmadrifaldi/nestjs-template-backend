import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';

import { SeederOptions } from 'typeorm-extension';

export const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  seeds: ['src/database/seeders/*{.ts,.js}'],
  factories: [],
};

const dataSource = new DataSource(options);
export default dataSource;
