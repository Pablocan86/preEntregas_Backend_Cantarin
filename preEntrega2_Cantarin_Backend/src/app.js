const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const messageRouter = require("./routes/messages.router.js");
const dotenv = require("dotenv");
const CartManager = require("./dao/cartManager.js");
const productModel = require("./dao/models/product.model.js");

const cartM = new CartManager();

// cartM.addToCart("6640030cccc05289c7bdb1aa", "664a084393033484c058ab1b");

// cartM.addCart();

dotenv.config();
console.log(process.env.MONGO_URL);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const environment = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  try {
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error en la conexión", error);
  }
};

environment();

app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", messageRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
