const express = require("express");
const path = require("path");
const app = express();
const productsRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/cart.router.js");
const CartManager = require("./cartManager.js");

const manager = new CartManager();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "public")));

app.use("/", productsRouter);
app.use("/", cartRouter);

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
