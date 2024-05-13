import { Request, Response } from "express";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NewspostsServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NewspostsServiceError";
  }
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
}
export class ExistingUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExistingUserError";
  }
}

// export class TokenExpiredError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "TokenExpiredError";
//   }
// }

export const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err.name === "ValidationError") {
    return res.status(400).send(`Помилка валідації: ${err.message}`);
  } else if (err.name === "NewspostsServiceError") {
    return res.status(500).send(`Помилка сервісу: ${err.message}`);
  } else if (err.name === "LoginError") {
    return res.status(401).send(`Помилка авторизації: ${err.message}`);
  } else if (err.name === "ExistingUserError") {
    return res.status(200).send(`Помилка реєстрації: ${err.message}`);
  }
};
