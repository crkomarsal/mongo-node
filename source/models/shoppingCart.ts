import mongoose, { Schema } from "mongoose";
import IShoppingCart from "../interfaces/shoppingCart";

const ShoppingCartSchema = new Schema({
  name: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  products: [{ name: String, quantity: Number }],
});

export default mongoose.model<IShoppingCart>(
  "ShoppingCart",
  ShoppingCartSchema
);
