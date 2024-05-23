import { DecodeToken } from "../services/decodeToken";
import { Users } from "../db/entity/Users";
import { AppDataSource } from "../db/data-source";

const userRepository = AppDataSource.getRepository(Users);

export const tokenDecoderMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedData = await DecodeToken(token);

    if (!decodedData) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    const { userName, password } = decodedData;

    const user = await userRepository.findOneBy({ userName });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to authenticate token", error });
  }
};
