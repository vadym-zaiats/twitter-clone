import express, { Router } from "express";
import bodyParser from "body-parser";
import UserController from "../controllers/user";
import passport from "passport";

class UserRouter {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.config();
  }

  private config(): void {
    this.router.use(bodyParser.json());

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Register a new user
     *     tags:
     *       - Users
     *     description: Register a new user with provided credentials.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       '200':
     *         description: A successful response
     */

    this.router.post("/register", UserController.signUp);

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: User login
     *     tags:
     *       - Users
     *     description: Authenticate user with provided credentials.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       '200':
     *         description: A successful response
     */

    this.router.post("/login", UserController.signIn);

    /**
     * @swagger
     * /api/user:
     *   get:
     *     summary: Get current user
     *     tags:
     *       - Users
     *     description: Retrieve information about the current authenticated user.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: A successful response
     */

    this.router.get(
      "/user",
      passport.authenticate("bearer", { session: false }),
      UserController.isUser
    );

    /**
     * @swagger
     * /api/auth/user/{userId}/posts:
     *   get:
     *     summary: Get posts of a user
     *     tags:
     *       - Users
     *     description: Retrieve posts created by a specific user.
     *     parameters:
     *       - in: path
     *         name: userId
     *         description: ID of the user
     *         required: true
     *         schema:
     *           type: string
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: A successful response
     */

    this.router.get(
      "/user/:userId/posts",
      passport.authenticate("bearer", { session: false }),
      UserController.getUsersPosts
    );
  }
}

export default new UserRouter().router;
