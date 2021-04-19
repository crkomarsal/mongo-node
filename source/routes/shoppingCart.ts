import express from "express";
import controller from "../controllers/shoppingCart";
import extractJWT from "../middleware/extractJWT";
import findUser from "../middleware/findUser";

const router = express.Router();

router.post(
  "/cart",
  extractJWT,
  findUser,
  controller.createShoppingCart
);
router.patch("/cart", extractJWT, findUser, controller.patchShoppingCart);
router.delete(
  "/cart",
  extractJWT,
  findUser,
  controller.deleteShoppingCart
);
router.post(
  "/product-quantity-aggregation",
  extractJWT,
  controller.aggregateProductQuantityByName
);

export = router;
