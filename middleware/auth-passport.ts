import { Strategy } from "passport-http-bearer";
import { type DecodedToken } from "../interfaces/interfaces";
import jwt from "jsonwebtoken";
import { Users } from "../db/entity/Users";
import { AppDataSource } from "../db/data-source";
import * as dotenv from "dotenv";
dotenv.config();

const userRepository = AppDataSource.getRepository(Users);

const authMiddleware = async (
  token: string,
  done: (err: Error | null, user?: any) => void
) => {
  const decodedData: DecodedToken = await new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.SECRET}`, async (err, decoded: any) => {
      if (err) {
        reject(null);
      } else {
        resolve(decoded);
      }
    });
  });
  const { userName, password } = decodedData;
  const isUserExist = await userRepository.findOneBy({
    userName,
  });

  if (!isUserExist) {
    console.log("PASSPORT.JS - NO USER");
    done(null, null);
    return;
  }

  if (decodedData.password !== password) {
    console.log("PASSPORT.JS - WRONG PASSWORD");
    done(null, null);
    return;
  }

  console.log("PASSPORT.JS - SUCCESS");
  done(null, decodedData);
};

export const bearerStrategy = new Strategy(authMiddleware);
