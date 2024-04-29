import express, { Router } from "express";
import bodyParser from "body-parser";
import NewsPostController from "../controllers/newspost";
import passport from "passport";

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
