import { Strategy } from "passport-http-bearer";
import * as dotenv from "dotenv";
import { Users } from "../db/entity/Users";
import { AppDataSource } from "../db/data-source";
import { DecodeToken } from "../services/decodeToken";
dotenv.config();

const userRepository = AppDataSource.getRepository(Users);

const authMiddleware = async (
  token: string,
  done: (err: Error | null, user: any) => void
) => {
  const decodedData = await DecodeToken(token);

  if (!decodedData) {
    done(null, null);
    return;
  }

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
