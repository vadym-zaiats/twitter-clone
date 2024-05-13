import { DecodedToken } from "../interfaces/interfaces";
import jwt from "jsonwebtoken";

export async function DecodeToken(token: string) {
  const decodedData: DecodedToken = await new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.SECRET}`, async (err, decoded: any) => {
      if (err) {
        reject(null);
      } else {
        resolve(decoded);
      }
    });
  });
  return decodedData;
}
