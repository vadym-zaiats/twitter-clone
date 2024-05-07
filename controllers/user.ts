import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../db/data-source";
import { Users } from "../db/entity/User";
import { checkUserService, hashPassword } from "../validation/users";
import {
  LoginError,
  ExistingUserError,
  ValidationError,
  NewspostsServiceError,
} from "../services/errorHandler";
import { errorHandler } from "../services/errorHandler";
import { Posts } from "../db/entity/Posts";
import { sendConfirmationEmail } from "../services/mailer";

const userRepository = AppDataSource.getRepository(Users);
const postsRepository = AppDataSource.getRepository(Posts);

class UserController {
  async signUp(req: Request, res: Response) {
    const check: any = checkUserService(req.body);
    if (check?.length > 0) {
      throw new ValidationError(check[0].message);
    }

    try {
      const { email, password, userName, displayName } = req.body;
      const isEmailExist = await userRepository.findOneBy({
        email,
      });
      const isUserNameExist = await userRepository.findOneBy({
        userName,
      });

      if (isEmailExist) {
        throw new ExistingUserError("User already exists");
      }
      if (isUserNameExist) {
        throw new ExistingUserError("This login is already in use");
      }
      const photoPath =
        req.files && req.files["photo"] ? req.files["photo"][0].path : null;
      const backgroundPath =
        req.files && req.files["background"]
          ? req.files["background"][0].path
          : null;

      const user = new Users();
      user.email = email;
      user.password = hashPassword(password);
      user.userName = userName;
      user.displayName = displayName;
      if (photoPath) {
        user.photo = photoPath;
      }
      if (backgroundPath) {
        user.background = backgroundPath;
      }

      await userRepository.save(user);

      const token = jwt.sign({ email, password }, "secret", {
        expiresIn: "1h",
      });

      sendConfirmationEmail(email, "http://www.google.com");

      return res.status(201).json({ token });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { userName, password } = req.body;
      const hashedPassword = hashPassword(password);

      const loginUseName = await userRepository.findOneBy({
        userName,
      });

      if (!loginUseName || loginUseName?.password !== hashedPassword) {
        throw new LoginError("Invalid username or password");
      }

      const token = jwt.sign(req.body, "secret", {
        expiresIn: "1h", // Термін дії токена
      });

      return res.status(200).json({ token });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async isUser(req: Request, res: Response) {
    try {
      if (req.user) {
        const decodedData = req.user as { email: string };

        if (!decodedData) {
          throw new LoginError("Token is not valid");
        }

        return res.json(decodedData.email);
      }
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getUsersPosts(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const posts = await postsRepository.find({
        where: { author: { id: userId } },
      });

      if (!posts) {
        throw new NewspostsServiceError(`getPostByUser ERROR`);
      }

      return res.status(200).json(posts);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async passwordForget(req: Request, res: Response) {
    const { email } = req.body;
    const userEmail = await userRepository.findOneBy({
      email,
    });
    if (!userEmail) {
      return res.status(404).json(`User ${email} doesn't exist`);
    }
    return res.status(200).json(`Check your email ${email}`);
  }
}

export default new UserController();
