const express = require("express");
const path = require("path");
const router = express.Router();
const CartManager = require("../cartManager.js");

const managerC = new CartManager();

router.post("/api/carts", async (req, res) => {
  try {
    managerC.creatCart();

    res.json({ message: "Se ha creado un nuevo 🛒" });
  } catch (error) {
    console.error("Error al crear el 🛒", error);
    res.status(500).send("Error interno del servidor");
  }
});
router.get("/api/carts/:cid", async (req, res) => {
  try {
    const idBuscado = parseInt(req.params.cid);
    console.log(idBuscado);
    const productsForCart = await managerC.getProductsForCart(idBuscado);
    res.json({ products: productsForCart });
  } catch (error) {}
});

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const db = await managerC.readBD();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    await managerC.addToCart(productId, cartId);
    const addedProduct = db.find((prod) => prod.id === productId);
    res.send(`Producto ${addedProduct.title} agregado al carrito`);
  } catch (error) {
    console.error("No se puede agregar el producto", error);
    res.status(500).send("Error de conexión");
  }
});

module.exports = router;
