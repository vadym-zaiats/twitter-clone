import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "./entity/User";
import { Posts } from "./entity/Posts";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: false,
  entities: [Users, Posts],
});
