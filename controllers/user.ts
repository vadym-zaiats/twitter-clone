import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { Like, MoreThan } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Users } from "../db/entity/Users";
import { Subscriptions } from "../db/entity/Subscriptions";
import { Followers } from "../db/entity/Followers";
import {
  checkUserService,
  checkNewPassService,
  hashPassword,
} from "../services/validation/users";
import { errorHandler } from "../services/errorHandler";
import { Posts } from "../db/entity/Posts";
import {
  sendConfirmationEmail,
  sendResetPasswordEmail,
} from "../services/mailer";
import { NewspostsServiceError } from "../services/errorHandler";
import crypto from "crypto";

const userRepository = AppDataSource.getRepository(Users);
const postsRepository = AppDataSource.getRepository(Posts);
const subscriptionRepository = AppDataSource.getRepository(Subscriptions);
const followersRepository = AppDataSource.getRepository(Followers);

class UserController {
  async signUp(req: Request, res: Response) {
    const check: any = checkUserService(req.body);
    if (check?.length > 0) {
      return res.json(check[0].message);
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
        return res
          .status(409)
          .json({ message: "This email is already in use" });
      }
      if (isUserNameExist) {
        return res
          .status(409)
          .json({ message: "This username is already in use" });
      }
      const photoPath =
        req.files && req.files["photo"] ? req.files["photo"][0].path : null;
      const backgroundPath =
        req.files && req.files["background"]
          ? req.files["background"][0].path
          : null;

      const hashPass = hashPassword(password);

      const user = new Users();
      user.email = email;
      user.password = hashPass;
      user.userName = userName;
      user.displayName = displayName;
      if (photoPath) {
        user.photo = photoPath;
      }
      if (backgroundPath) {
        user.background = backgroundPath;
      }

      await userRepository.save(user);

      const token = jwt.sign({ userName, hashPass }, `${process.env.SECRET}`, {
        expiresIn: "1h",
      });

      sendConfirmationEmail(email, "http://www.google.com");

      return res.status(201).json({ token });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async logIn(req: Request, res: Response) {
    try {
      const { userName, password, rememberMe } = req.body;

      const hashedPassword = hashPassword(password);

      const loginUseName = await userRepository.findOneBy({
        userName,
      });

      if (!loginUseName || loginUseName?.password !== hashedPassword) {
        return res.status(401).json({ message: "Invalid login or password" });
      }

      const tokenExpiry = rememberMe ? "30d" : "2h";

      const token = jwt.sign(
        { userName, password: hashedPassword },
        `${process.env.SECRET}`,
        {
          expiresIn: tokenExpiry,
        }
      );

      return res.status(200).json({ token });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async editMyData(req: Request, res: Response) {
    const check: any = checkUserService(req.body);
    if (check?.length > 0) {
      return res.json(check[0].message);
    }

    try {
      if (req.user) {
        const decodedData = req.user as { userName: string };
        if (!decodedData) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }
        const myData = await userRepository.findOneBy({
          userName: decodedData.userName,
        });
        if (!myData) {
          return res.status(404).json({ message: "User not found" });
        }

        const { email, userName, displayName, password } = req.body;

        const isEmailExist = await userRepository.findOneBy({
          email,
        });

        if (isEmailExist) {
          return res
            .status(409)
            .json({ message: "This email is already in use" });
        }

        const isUserNameExist = await userRepository.findOneBy({
          userName,
        });

        if (isUserNameExist) {
          return res
            .status(409)
            .json({ message: "This username is already in use" });
        }

        const hashPass = hashPassword(password);

        if (email) {
          myData.email = email;
        }
        if (userName) {
          myData.userName = userName;
        }
        if (displayName) {
          myData.displayName = displayName;
        }
        if (password) {
          myData.password = hashPass;
        }

        await userRepository.save(myData);

        return res.json(myData);
      }
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getMyData(req: Request, res: Response) {
    try {
      if (req.user) {
        const decodedData = req.user as { userName: string };
        if (!decodedData) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }
        const userData = await userRepository.findOneBy({
          userName: decodedData.userName,
        });

        return res.json(userData);
      }
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getUserData(req: Request, res: Response) {
    try {
      const id = req.body.userId;
      const userData = await userRepository.findOneBy({
        id,
      });
      return res.json(userData);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getUserDataByUserName(req: Request, res: Response) {
    try {
      const userName = req.body.search;
      const userData = await userRepository.findOneBy({
        userName,
      });
      return res.json(userData);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async searchUsersAndPosts(req: Request, res: Response) {
    try {
      const searchQuery = req.body.search;

      const userResult = await userRepository.findOneBy({
        userName: searchQuery,
      });

      const postResult = await postsRepository.find({
        where: [
          { text: Like(`%${searchQuery}%`) },
          { title: Like(`%${searchQuery}%`) },
        ],
      });

      return res.json({ userResult, postResult });
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

  async toggleSubscription(req: Request, res: Response) {
    const { userId, targetUserId } = req.body;

    try {
      const subscriber = await userRepository.findOneBy({
        id: userId,
      });
      if (!subscriber) {
        return res.status(404).send("Subscriber not found");
      }
      const targetUser = await userRepository.findOneBy({
        id: targetUserId,
      });
      if (!targetUser) {
        return res.status(404).send("Target user not found");
      }

      const existingSubscription = await subscriptionRepository.findOne({
        where: { user: subscriber, subscribed: targetUser },
      });

      if (existingSubscription) {
        await subscriptionRepository.delete({
          user: userId,
          subscribed: targetUserId,
        });
        return res.status(200).send("Unsubscribed successfully");
      }

      const subscription = new Subscriptions();
      subscription.user = subscriber;
      subscription.subscribed = targetUser;
      const followers = new Followers();
      followers.user = targetUser;
      followers.following = subscriber;

      await subscriptionRepository.save(subscription);
      await followersRepository.save(followers);

      return res.status(200).send("Subscribed successfully");
    } catch (error) {
      console.error("Error toggle subscription:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSubsUsersPosts(req: Request, res: Response) {
    const { userId } = req.body;

    try {
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["subscriptions", "subscriptions.subscribedTo.posts"],
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const posts = user.subscriptions
        .map((subscription) => subscription.subscribed.posts)
        .flat();

      return res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching favorite posts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUsersSubs(req: Request, res: Response) {
    const { userId } = req.body;

    try {
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["subscriptions", "subscriptions.subscribedTo"],
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const subscriptions = user.subscriptions
        .map((subscription) => subscription.subscribed)
        .flat();

      return res.status(200).json(subscriptions);
    } catch (error) {
      console.error("Error fetching favorite posts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUsersFollowers(req: Request, res: Response) {
    const { userId } = req.body;

    try {
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["followers.following"],
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const followers = user.followers
        .map((follower) => follower.following)
        .flat();

      return res.status(200).json(followers);
    } catch (error) {
      console.error("Error fetching favorite posts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          message: "Користувача з такою електронною адресою не знайдено",
        });
      }

      const token = crypto.createHash("sha256").digest("hex");

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 година

      await userRepository.save(user);

      const resetLink = `${req.protocol}://${req.get(
        "host"
      )}/reset-password/${token}`;

      sendResetPasswordEmail(user.email, resetLink);

      res.status(200).json({
        message:
          "Посилання для відновлення пароля було відправлено на вашу електронну адресу",
      });
    } catch (error) {
      res.status(500).json({
        message: "Сталася помилка, будь ласка, спробуйте ще раз пізніше",
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { newPassword } = req.body;

    const check: any = checkNewPassService(req.body);
    if (check?.length > 0) {
      return res.json(check[0].message);
    }

    try {
      const user = await userRepository.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: MoreThan(Date.now()), // Використання оператора MoreThan
        },
      });

      if (!user) {
        return res.status(400).json({
          message:
            "Токен для скидання пароля недійсний або строк його дії минув",
        });
      }

      const hashedPassword = hashPassword(newPassword);
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await userRepository.save(user);

      res.status(200).json({ message: "Пароль успішно змінено" });
    } catch (error) {
      res.status(500).json({
        message: "Сталася помилка, будь ласка, спробуйте ще раз пізніше",
      });
    }
  }
}

export default new UserController();
