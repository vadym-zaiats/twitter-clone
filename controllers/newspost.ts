/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
// import IoService from "../services/io";
import { checkPostService } from "../validation/posts";
import { Posts } from "../db/entity/Posts";
import { Users } from "../db/entity/User";
import { AppDataSource } from "../db/data-source";
import {
  ValidationError,
  NewspostsServiceError,
  LoginError,
} from "../services/errorHandler";
import { type DecodedToken } from "../interfaces/interfaces";
import { errorHandler } from "../services/errorHandler";

const postRepository = AppDataSource.getRepository(Posts);
const userRepository = AppDataSource.getRepository(Users);

class NewsPostController {
  async createNewPost(req: Request, res: Response) {
    try {
      const check: any = checkPostService(req.body);

      if (check?.length > 0) {
        throw new ValidationError(check[0].message);
      }

      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new LoginError(check[0].message);
      }

      const decodedData: DecodedToken = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          `${process.env.SECRET}`,
          async (err, decoded: any) => {
            if (err) {
              reject(null);
            } else {
              resolve(decoded);
            }
          }
        );
      });
      const { email } = decodedData;

      const user = await userRepository.findOneBy({
        email,
      });

      if (!user) {
        throw new Error("Користувача з таким email не знайдено");
      }

      const picturePath = req.file ? req.file.path : null;

      const { title, text } = req.body;
      const post = new Posts();
      post.title = title;
      post.text = text;
      post.author = user;
      if (picturePath) {
        post.picture = picturePath;
      }

      // const alertUsers = await userRepository.find({
      //   where: {
      //     sendNotification: true,
      //   },
      // });

      // const filteredAlertUsers = alertUsers.filter(
      //   (alertUser) => alertUser.email !== user.email
      // );

      // const messages = filteredAlertUsers
      //   .map((alertUser) => {
      //     if (alertUser.notificationChannel) {
      //       return {
      //         userEmail: alertUser.email,
      //         channel: alertUser.notificationChannel,
      //       };
      //     }
      //     return null;
      //   })
      //   .filter((message) => message !== null);

      // console.log("messages", messages);

      await postRepository.save(post);

      // SOCKET IO
      // messages.forEach((message) => {
      //   IoService.io.emit("newpost", {
      //     userEmail: message?.userEmail,
      //     log: message?.channel,
      //   });
      // });

      return res.status(200).json(post);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getAllPosts(req: Request, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 100; // усі

      const paginatedPosts = await AppDataSource.manager.find(Posts, {
        relations: ["author"],
        skip,
        take,
      });

      const allPosts = await AppDataSource.manager.find(Posts);

      if (!allPosts) {
        throw new NewspostsServiceError(
          "Помилка на сервері при отриманні усіх постів"
        );
      }

      const allPostsLength = allPosts.length;

      return res.status(200).json({ allPosts: paginatedPosts, allPostsLength });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const post = await postRepository.findOne({
        where: { id },
        relations: ["author"],
      });
      if (!post) {
        throw new NewspostsServiceError(`Цього посту не існує. ID ${id} ???`);
      }
      return res.status(200).json(post);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async editPost(req: Request, res: Response) {
    const check: any = checkPostService(req.body);
    if (check?.length > 0) {
      throw new ValidationError(check[0].message);
    }

    const id = parseInt(req.params.id);
    const { title, text } = req.body;
    try {
      const post = await postRepository.findOne({ where: { id } });
      if (!post) {
        throw new NewspostsServiceError(`Post id: ${id} doesn't exist`);
      }
      if (title !== undefined) {
        post.title = title;
      }
      if (text !== undefined) {
        post.text = text;
      }
      await postRepository.save(post);

      // Повернення оновленого посту
      return res.status(200).json(post);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async deletePost(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const post = await postRepository.findOne({ where: { id } });
      if (!post) {
        throw new NewspostsServiceError(`Post id: ${id} doesn't exist`);
      }
      await postRepository
        .createQueryBuilder()
        .delete()
        .from(Posts)
        .where("id = :id", { id })
        .execute();

      return res.status(200).json({ message: `Post id: ${id} deleted` });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async addPostToFavorite(req: Request, res: Response) {}
}

export default new NewsPostController();
