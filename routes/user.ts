import express, { Router } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import multer from "multer";
import fs from "fs";
import UserController from "../controllers/user";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "imgs/users";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

class UserRouter {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.config();
  }

  private config(): void {
    this.router.use(bodyParser.json());

    this.router.post(
      "/register",
      upload.single("photo"),
      UserController.signUp
    );

    this.router.post("/login", UserController.signIn);

    this.router.get(
      "/user",
      passport.authenticate("bearer", { session: false }),
      UserController.isUser
    );

    this.router.get(
      "/user/:userId/posts",
      passport.authenticate("bearer", { session: false }),
      UserController.getUsersPosts
    );
  }
}

export default new UserRouter().router;
