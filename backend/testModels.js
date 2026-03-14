import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import { Category } from "./models/category.model.js";
import { Product } from "./models/product.model.js";
import { Location } from "./models/location.model.js";
import { StockQuant } from "./models/stockQuant.model.js";
import { StockMove } from "./models/stockMove.model.js";

// Simply ensuring they compile correctly without throwing errors
console.log("All IMS models successfully imported and registered with Mongoose.");
console.log({
  User: User.modelName,
  Category: Category.modelName,
  Product: Product.modelName,
  Location: Location.modelName,
  StockQuant: StockQuant.modelName,
  StockMove: StockMove.modelName,
});
