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

    /**
     * @swagger
     * /api/newsposts:
     *   get:
     *     summary: Get all posts
     *     tags:
     *       - NewsPosts
     *     description: Retrieve a list of all posts
     *     responses:
     *       '200':
     *         description: A successful response
     *       '500':
     *         description: Internal server error
     *   post:
     *     summary: Create a new post
     *     tags:
     *       - NewsPosts
     *     description: Create a new post
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '201':
     *         description: Post created successfully
     *       '400':
     *         description: Bad request
     *       '401':
     *         description: Unauthorized
     *       '500':
     *         description: Internal server error
     */

    this.router
      .route("/")
      .get(NewsPostController.getAllPosts)
      .post(
        passport.authenticate("bearer", { session: false }),
        NewsPostController.createNewPost
      );

    /**
     * @swagger
     * /api/newsposts/{id}:
     *   get:
     *     summary: Get post by ID
     *     tags:
     *       - NewsPosts
     *     description: Retrieve a post by its ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: A successful response
     *       '404':
     *         description: Post not found
     *       '500':
     *         description: Internal server error
     *   put:
     *     summary: Update post
     *     tags:
     *       - NewsPosts
     *     description: Update an existing post
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: Post updated successfully
     *       '400':
     *         description: Bad request
     *       '401':
     *         description: Unauthorized
     *       '404':
     *         description: Post not found
     *       '500':
     *         description: Internal server error
     *   delete:
     *     summary: Delete post
     *     tags:
     *       - NewsPosts
     *     description: Delete an existing post
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '204':
     *         description: Post deleted successfully
     *       '401':
     *         description: Unauthorized
     *       '404':
     *         description: Post not found
     *       '500':
     *         description: Internal server error
     */

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
