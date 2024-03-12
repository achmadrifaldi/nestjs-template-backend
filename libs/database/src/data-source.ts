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
  seeds: [__dirname + '/seeder/*{.js,.ts}'],
  factories: [],
  logging: true,
  entities: [__dirname + '/entity/*.entity{.js,.ts}'],
  subscribers: [__dirname + '/subscriber/*{.js,.ts}'],
  migrations: [],
};

const dataSource = new DataSource(options);
export default dataSource;
