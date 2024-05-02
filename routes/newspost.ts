import express, { Router } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import multer from "multer";
import fs from "fs";
import NewsPostController from "../controllers/newspost";

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

class PostRouter {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.config();
  }

  private config(): void {
    this.router.use(bodyParser.json());

    this.router
      .route("/")
      .get(NewsPostController.getAllPosts)
      .post(
        passport.authenticate("bearer", { session: false }),
        NewsPostController.createNewPost
      );

    this.router
      .route("/:id")
      .get(NewsPostController.getPostById)
      .put(
        passport.authenticate("bearer", { session: false }),
        NewsPostController.editPost
      )
      .delete(
        passport.authenticate("bearer", { session: false }),
        NewsPostController.deletePost
      );
  }
}

export default new PostRouter().router;
