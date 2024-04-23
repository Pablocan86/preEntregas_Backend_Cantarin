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
    if (productsForCart) {
      res.json({ products: productsForCart });
    } else {
      res.json({ message: "No existe 🛒" });
    }
  } catch (error) {
    console.error("No existe carrito");
    res.status(500).send("No existen datos", error);
  }
});

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const db = await managerC.readBD();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const addedProduct = db.find((prod) => prod.id === productId);
    if (addedProduct) {
      const carts = await managerC.readCart();
      const existCart = carts.find((cart) => cart.id === cartId);
      if (existCart) {
        res.send(
          `Producto ${addedProduct.title} agregado al carrito con id: ${existCart.id}`
        );
        await managerC.addToCart(productId, cartId);
      } else {
        res.send(`No existe carrito con id ${cartId}`);
        return;
      }
    } else {
      res.send(`Producto con ID: ${productId} inexistente en la base de datos`);
    }
  } catch (error) {
    console.error("No se puede agregar el producto", error);
    res.status(500).send("Error de conexión");
  }
});

module.exports = router;
