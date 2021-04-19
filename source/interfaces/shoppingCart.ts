import { Document } from "mongoose";

export default interface IShoppingCart extends Document {
  name: string;
  userId: string;
  createdAt: Date;
  products: any[];
}
