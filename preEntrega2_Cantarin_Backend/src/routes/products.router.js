const express = require("express");
const router = express.Router();
const productModel = require("../dao/models/product.model.js");
const ProductManager = require("../dao/productManager.js");
const productManager = new ProductManager();

router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page);
  try {
    if (!page) page = 1;
    let result = await productModel.paginate(
      {},

      { page, limit: 3, lean: true }
    );
    result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
    result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";
    result.isValid = !(page <= 0 || page > result.totalPages);
    result.style = "products.css";
    //Renderizado en el handlebars
    res.render("products", result);
    //Objeto de consinga
    // res.send({
    //   status: "success/error",
    //   payload: result.docs,
    //   totalPages: result.totalPages,
    //   prevPage: result.prevPage,
    //   nextPage: result.nextPage,
    //   page: result.page,
    //   hasPrevPage: result.hasPrevPage,
    //   hasNextPage: result.hasNextPage,
    //   prevLink: result.prevLink,
    //   nextLink: result.nextLink,
    // });
  } catch (error) {
    res.send({ status: "error" });
  }
});
router.get("/productsHome", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let products2 = await productModel.paginate({}, { limit: 3, page: 1 });
    let filter = await productModel.aggregate([
      //Busca todos los que tienen ese precio
      { $match: { price: 2500 } },
      //Suma los precios
      {
        $group: { _id: "$price", totalQuantity: { $sum: "$price" } },
      },
    ]);

    console.log(filter);
    console.log(products2);
    res.render("productsHome", { products, style: "products.css" });
    // res.send({ result: "success", payload: products });
  } catch (error) {
    console.error("No se encuentran productos en la Base de datos", error);
  }
});
router.get("/productsManager", async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    if (!page) page = 1;
    let result = await productModel.paginate(
      {},
      { page, limit: 3, lean: true }
    );
    result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
    result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";
    result.isValid = !(page <= 0 || page > result.totalPages);
    result.style = "products.css";

    res.render("productsManager", result);
    // res.send({ result: "success", payload: products });
  } catch (error) {
    console.error("No se encuentran productos en la Base de datos", error);
  }
});

router.post("/productsManager", async (req, res) => {
  let { title, description, price, thumbnail, code, status, category, stock } =
    req.body;
  let page = parseInt(req.query.page);
  if (!page) page = 1;
  let result = await productModel.paginate({}, { page, limit: 3, lean: true });
  result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
  result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";
  result.isValid = !(page <= 0 || page > result.totalPages);
  result.style = "products.css";
  result.agregado = "Producto agregado correctamente";

  try {
    await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      category,
      stock
    );

    res.render("productsManager", result);
    // res
    //   .status(201)
    //   .json({ message: `Producto ${title} agregado correctamente` });
  } catch (error) {
    let products = await productManager.getProducts();
    if (error.message === "No se han completado todos los campos") {
      result.error = "No se han completado todos los campos";
      res.render("productsManager", result);
    } else if (error.message === "Número de código existente") {
      result.error = "Número de código existente";
      res.render("productsManager", result);
      // res.status(400).json({ error: "Número de código existente" });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
});

router.put("/:uid", async (req, res) => {
  let { uid } = req.params;
  let { title, description, price, thumbnail, code, status, category, stock } =
    req.body;

  try {
    await productManager.updateProduct(
      uid,
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      category,
      stock
    );
    let products = await productModel.find();
    const exist = products.find((prod) => prod.id === uid);
    res.status(201).json({ message: `Producto ${exist.title} actualizado` });
  } catch (error) {
    if (error.message === "Producto no existe en la base de datos") {
      res.status(400).json({ error: "Producto no existe en la base de datos" });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
});

router.delete("/productsManager/:uid", async (req, res) => {
  let { uid } = req.params;
  let products = await productModel.find();
  try {
    await productManager.deleteProduct(uid);
    res.render("productsManager");
  } catch (error) {
    if (
      error.message === "No se encuentra producto con es id en la base de datos"
    ) {
      res.status(400).json({
        error: `No se encuentra producto con ID: ${uid} en la base de datos`,
      });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
});

module.exports = router;
