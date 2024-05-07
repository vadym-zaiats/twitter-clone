import express, { Router } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import multer from "multer";
import fs from "fs";
import UserController from "../controllers/user";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "photo") {
      const dir = "imgs/users/photo";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    }
    if (file.fieldname === "background") {
      const dir = "imgs/users/background";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    }
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
      upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "background", maxCount: 1 },
      ]),
      UserController.signUp
    );

    this.router.post("/login", UserController.signIn);

    this.router.get(
      "/user",
      passport.authenticate("bearer", { session: false }),
      UserController.userData
    );

    this.router.get(
      "/user/:userId/posts",
      passport.authenticate("bearer", { session: false }),
      UserController.getUsersPosts
    );

    this.router.post("/password/forget", UserController.passwordForget);
  }
}

export default new UserRouter().router;
