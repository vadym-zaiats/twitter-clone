import { DecodedToken } from "../interfaces/interfaces";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export async function DecodeToken(token: string) {
  try {
    const decodedData: DecodedToken | null = await new Promise(
      (resolve, reject) => {
        jwt.verify(
          token,
          `${process.env.SECRET}`,
          async (err, decoded: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(decoded);
            }
          }
        );
      }
    );
    return decodedData;
  } catch (error) {
    console.error("Помилка декодування токена:", error);
    return null;
  }
}
