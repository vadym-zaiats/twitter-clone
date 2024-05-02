// import IoService from "./services/io";
// import swaggerUi from "swagger-ui-express";
import express, { type Express } from "express";
import cors from "cors";
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import * as dotenv from "dotenv";
import newspostsConfigs from "./routes/newspost";
import userConfigs from "./routes/user";
import { errorHandler } from "./services/errorHandler";
import { bearerStrategy } from "./middleware/auth-passport";
import { AppDataSource } from "./db/data-source";
import "reflect-metadata";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Passport Auth Api",
      version: "0.0.1",
    },
  },
  apis: ["./routes/*.ts"],
};

const swaggerDocument = swaggerJSDoc(swaggerOptions);

class Server {
  app: Express;
  PORT: number;

  constructor() {
    this.app = express();
    this.PORT = Number(process.env.PORT) || 8000;

    dotenv.config();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
    this.configureDbConnection();
  }

  private configureDbConnection(): void {
    if (!AppDataSource.isInitialized) {
      AppDataSource.initialize()
        .then(() => {
          console.log("Database connection established successfully.");
        })
        .catch((error) => {
          console.error("Error during database connection:", error);
        });
    } else {
      console.log("Database connection already established.");
    }
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    passport.use(bearerStrategy);
  }

  private configureRoutes(): void {
    this.app.use("/api/", userConfigs);
    this.app.use("/api/auth/", userConfigs);
    this.app.use("/api/newsposts/", newspostsConfigs);
    // this.app.use(
    //   "/api/docs",
    //   swaggerUi.serve,
    //   swaggerUi.setup(swaggerDocument)
    // );
  }

  private configureErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    // IoService.ws();
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}

const server = new Server();
server.start();
