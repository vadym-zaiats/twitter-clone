import express, { Router } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import multer from "multer";
import fs from "fs";
import NewsPostController from "../controllers/newspost";
import { generateUniqueFilename } from "../services/uniqueFileName";
import { tokenDecoderMiddleware } from "../middleware/tokenDecoder.middleware";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "imgs/posts/pictures";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  filename: function (req, file, cb) {
    const uniqueFilename = generateUniqueFilename(file.originalname);
    cb(null, uniqueFilename);
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
        tokenDecoderMiddleware,
        passport.authenticate("bearer", { session: false }),
        upload.single("picture"),
        NewsPostController.createNewPost
      );

    this.router
      .route("/post/:id")
      .get(NewsPostController.getPostById)
      .put(
        tokenDecoderMiddleware,
        passport.authenticate("bearer", { session: false }),
        NewsPostController.editPost
      )
      .delete(
        tokenDecoderMiddleware,
        passport.authenticate("bearer", { session: false }),
        NewsPostController.deletePost
      );

    this.router
      .route("/favorite")
      .get(
        tokenDecoderMiddleware,
        passport.authenticate("bearer", { session: false }),
        NewsPostController.getFavoritePosts
      )
      .post(
        tokenDecoderMiddleware,
        passport.authenticate("bearer", { session: false }),
        NewsPostController.toggleFavorite
      );

    this.router.route("/search").get(NewsPostController.searchPost);
  }
}

export default new PostRouter().router;
