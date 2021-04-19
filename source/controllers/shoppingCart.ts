import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import ShoppingCart from "../models/shoppingCart";
import logging from "../config/logging";
import IShoppingCart from "../interfaces/shoppingCart";

const NAMESPACE = "Shopping Cart Controller";

const createShoppingCart = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, createdAt, products } = req.body;
  const { user } = res.locals;

  if (!user.email) {
    return res.status(404).json({
      message: "Could not find user",
    });
  }

  const shoppingCart = new ShoppingCart({
    _id: new mongoose.Types.ObjectId(),
    userId: user._id,
    name,
    createdAt: new Date(createdAt),
    products: products || [],
  });
  return shoppingCart
    .save()
    .then((result) => {
      return res.status(201).json({
        shoppingCart: result,
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

const patchShoppingCart = (req: Request, res: Response, next: NextFunction) => {
  const { name, newName, products } = req.body;
  const { user } = res.locals;

  if (!user._id) {
    return res.status(404).json({
      message: "Could not find user",
    });
  }

  ShoppingCart.find({ name, userId: user._id })
    .exec()
    .then((response: IShoppingCart[]) => {
      const cart = response[0];

      if (!cart) {
        return res.status(404).json({
          message: "Could not find cart",
        });
      }

      return cart
        .updateOne({
          name: newName || name,
          products: products || cart.products,
        })
        .then((response: any) => {
          return res.status(200).json({
            message: "Cart successfully updated",
          });
        })
        .catch((error: any) => {
          logging.error(NAMESPACE, error.message, error);
          return res.status(500).json({
            message: error.message,
            error,
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

const deleteShoppingCart = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const { user } = res.locals;

  if (!user._id) {
    return res.status(404).json({
      message: "Could not find user",
    });
  }

  ShoppingCart.find({ name, userId: user._id })
    .exec()
    .then((response: IShoppingCart[]) => {
      const cart = response[0];

      if (!cart) {
        return res.status(404).json({
          message: "Could not find cart",
        });
      }

      return cart
        .deleteOne()
        .then((response: any) => {
          return res.status(200).json({
            message: "Cart successfully deleted",
          });
        })
        .catch((error: any) => {
          logging.error(NAMESPACE, error.message, error);
          return res.status(500).json({
            message: error.message,
            error,
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

const aggregateProductQuantityByName = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { from, to } = req.body;

  ShoppingCart.aggregate([
    {
      $match: { createdAt: { $gte: new Date(from), $lt: new Date(to) } },
    },
    {
      $unwind: "$products",
    },
    {
      $group: {
        _id: "$products.name",
        Sum: { $sum: "$products.quantity" },
      },
    },
    {
      $group: {
        _id: 0,
        products: { $push: { products: "$_id", Sum: "$Sum" } },
      },
    },
    {
      $project: { products: 1, _id: 0 },
    },
  ])
    .then((response: any) => {
      return res.status(200).json({
        aggregation: response,
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

export default {
  createShoppingCart,
  patchShoppingCart,
  deleteShoppingCart,
  aggregateProductQuantityByName,
};
