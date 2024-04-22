const express = require("express");
const path = require("path");
const router = express.Router();
const ProductManager = require("../productManager");

const managerP = new ProductManager();

router.get("/api/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || null;
    let products = await managerP.readProducts();

    if (limit !== null) {
      products = products.slice(0, limit);
    }

    res.json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/api/products/:id", async (req, res) => {
  try {
    let idProduct = parseInt(req.params.id);

    let productById = await managerP.getProductById(idProduct);
    if (!productById) {
      res.send(`Producto con ID:${idProduct} no existente`);
    } else {
      res.send(productById);
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/api/product", async (req, res) => {
  try {
    const products = await managerP.readProducts();
    const {
      title,
      description,
      price,
      status = "true",
      thumbnail,
      code,
      stock,
      category,
    } = req.body;
    const existente = products.find((prod) => prod.code === code);
    if (existente) {
      res.send("Productos existente");
    } else {
      await managerP.addProduct(
        title,
        description,
        price,
        status,
        thumbnail,
        code,
        stock,
        category
      );
      res.send(`Producto agregado a la base de datos `);
    }
  } catch (error) {
    console.error("El producto ya existe", error);
    res.status(500).send("El producto ya existe en la base de datos");
  }
});

router.put("/api/product/:id", async (req, res) => {
  try {
    const products = await managerP.readProducts();
    let idProduct = parseInt(req.params.id);
    const { id, title, description, price, thumbnail, code, stock, category } =
      req.body;
    const existente = products.filter((prod) => prod.id === idProduct);
    if (!existente) {
      res.send(`No existe producto en la base de datos`);
    }
    if (existente) {
      await managerP.updateProduct(
        idProduct,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
      );
      res.send(`Producto actualizado a la base de datos `);
    }
  } catch (error) {
    console.error("No se puede actualizar el producto", error);
    res.status(500).send("El producto no existe en la base de datos");
  }
});

router.delete("/api/product/:id", async (req, res) => {
  try {
    const products = await managerP.readProducts();
    let productId = parseInt(req.params.id);
    await managerP.deleteProduct(productId);
    const productoBorrar = products.find((prod) => prod.id === productId);
    res.send(`Producto ${productoBorrar.title} fue borrado`);
  } catch (error) {
    console.error("No existe el producto", error);
    res.status(500).send("No se puede borrar producto por inexistencia");
  }
});

module.exports = router;
