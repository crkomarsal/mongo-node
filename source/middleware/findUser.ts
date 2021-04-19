import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import logging from "../config/logging";
import IUser from "../interfaces/user";

const NAMESPACE = "User Middleware";

const findUser = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "Finding User", null);

  const { jwt } = res.locals;

  if (!jwt.email) {
    res.status(404).json({
      message: "User not found",
    });
  }

  User.find({ email: jwt.email })
    .exec()
    .then((response: IUser[]) => {
      res.locals.user = response[0];
      next();
    })
    .catch((error: any) => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

export default findUser;
