import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import logging from "../config/logging";
import User from "../models/user";
import signJWT from "../functions/signJWT";

const NAMESPACE = "User Controller";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "Token validated, user authorized", null);

  return res.status(200).json({
    message: "User authorized",
  });
};

const register = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  bcryptjs.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      return res.status(500).json({
        message: hashError.message,
        error: hashError,
      });
    }

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hash,
    });

    return user
      .save()
      .then((response) => {
        return res.status(201).json({
          user: response,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error,
        });
      });
  });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.find({ email })
    .exec()
    .then((response: any[]) => {
      const user = response[0];

      bcryptjs.compare(password, user.password, (error, result) => {
        if (error || !result) {
          logging.error(NAMESPACE, error && error.message, error);
          return res.status(401).json({
            message: "Unauthorized",
          });
        }
        signJWT(user, (error, token) => {
          if (error) {
            logging.error(NAMESPACE, error.message, error);
            return res.status(401).json({
              message: "Unauthorized",
              error,
            });
          } else if (token) {
            return res.status(200).json({
              message: "Auth successful",
              token,
            });
          }
        });
      });
    })
    .catch((error: any) => {
      logging.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

const changePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const { jwt } = res.locals;

  if (!jwt.email) {
    return res.status(404).json({
      message: "Could not find user",
    });
  }

  bcryptjs.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      return res.status(500).json({
        message: hashError.message,
        error: hashError,
      });
    }

    User.findOneAndUpdate(
      { email: jwt.email },
      { password: hash },
      { returnOriginal: false },
      (error, response) => {
        if (error) {
          return res.status(500).json({
            message: error.message,
            error,
          });
        }

        return res.status(200).json({
          message: "Password successfully updated",
        });
      }
    );
  });
};

export default {
  validateToken,
  register,
  login,
  changePassword,
};
