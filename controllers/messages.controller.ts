import { Request, Response } from "express";
import { Message } from "../db/entity/Message";
import { Users } from "../db/entity/Users";
import { AppDataSource } from "../db/data-source";

const userRepository = AppDataSource.getRepository(Users);
const messageRepository = AppDataSource.getRepository(Message);

class MessagesController {
  static async sendMessage(req: Request, res: Response) {
    const { senderId, receiverId, content } = req.body;

    const sender = await userRepository.findOne(senderId);
    const receiver = await userRepository.findOne(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = new Message();
    message.sender = sender;
    message.receiver = receiver;
    message.content = content;

    await messageRepository.save(message);

    return res.status(201).json(message);
  }

  static async getMessages(req: Request, res: Response) {
    // const { userId1, userId2 } = req.params;
    // const messages = await messageRepository.find({
    //   where: [
    //     { sender: userId1, receiver: userId2 },
    //     { sender: userId2, receiver: userId1 },
    //   ],
    //   order: { timestamp: "ASC" },
    // });
    // return res.status(200).json(messages);
  }
}

export default new MessagesController();
