import express, { Router } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import messagesController from "../controllers/messages.controller";
import { tokenDecoderMiddleware } from "../middleware/tokenDecoder.middleware";

class MessagesRouter {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.config();
  }

  private config(): void {
    this.router.use(bodyParser.json());

    this.router.route("/send").post(
      // tokenDecoderMiddleware,
      // passport.authenticate("bearer", { session: false }),
      messagesController.sendMessage
    );

    this.router.route("/:userId1/:userId2").get(
      // tokenDecoderMiddleware,
      // passport.authenticate("bearer", { session: false }),
      messagesController.getMessages
    );
  }
}

export default new MessagesRouter().router;
