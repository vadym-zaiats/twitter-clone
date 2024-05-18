import express, { Router } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import multer from "multer";
import fs from "fs";
import UserController from "../controllers/user";
import { generateUniqueFilename } from "../services/uniqueFileName";

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
    const uniqueFilename = generateUniqueFilename(file.originalname);
    cb(null, uniqueFilename);
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

    this.router
      .route("/user")
      .get(
        passport.authenticate("bearer", { session: false }),
        UserController.getMyData
      )
      .post(
        passport.authenticate("bearer", { session: false }),
        UserController.toggleSubscription
      )
      .put(
        passport.authenticate("bearer", { session: false }),
        upload.fields([
          { name: "photo", maxCount: 1 },
          { name: "background", maxCount: 1 },
        ]),
        UserController.editMyData
      );

    this.router.route("/user-info").get(UserController.getUserData);

    this.router.get("/user/search", UserController.getUserDataByUserName);

    this.router.get(
      "/user/search-user-info",
      UserController.searchUsersAndPosts
    );

    this.router
      .route("/user/get-user-subscriptions-posts")
      .get(
        passport.authenticate("bearer", { session: false }),
        UserController.getSubsUsersPosts
      );

    this.router
      .route("/user/get-user-subscriptions")
      .get(
        passport.authenticate("bearer", { session: false }),
        UserController.getUsersSubs
      );
    this.router
      .route("/user/get-user-followers")
      .get(
        passport.authenticate("bearer", { session: false }),
        UserController.getUsersFollowers
      );

    this.router.get(
      "/user/:userId/posts",
      passport.authenticate("bearer", { session: false }),
      UserController.getUsersPosts
    );

    // this.router.post("/password/forget", UserController.passwordForget);
  }
}

export default new UserRouter().router;
