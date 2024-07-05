const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsCotroller.js");
const productModel = require("../dao/models/product.model.js");
const cartModel = require("../dao/models/cart.model.js");
const ProductManager = require("../dao/classes/product.dao.js");
const productManager = new ProductManager();
const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middleware/auth.js");
//Ruta raíz que devuelve el objeto de la primer consigna
// router.get("/", async (req, res) => {
//   let { limit = 3, page = 1, sort, category } = req.query;
//   limit = parseInt(limit);
//   page = parseInt(page);

//   try {
//     // Construir filtro de búsqueda
//     let filter = {};
//     if (category) {
//       // Buscar por categoría o disponibilidad
//       filter = {
//         $or: [
//           { category: category.toUpperCase() },
//           { available: category.toLowerCase() === "true" }, // Comparar como booleano
//         ],
//       };
//     }

//     // Opciones de sorteo
//     let sortOptions = {};
//     if (sort) {
//       sortOptions.price = sort === "asc" ? 1 : -1;
//     }

//     // Obtener el total de productos que coinciden con el filtro
//     const totalProducts = await productModel.countDocuments(filter);

//     // Calcular la paginación
//     const totalPages = Math.ceil(totalProducts / limit);
//     const offset = (page - 1) * limit;

//     // Obtener productos paginados
//     const products = await productModel
//       .find(filter)
//       .lean()
//       .sort(sortOptions)
//       .skip(offset)
//       .limit(limit);

//     // Construir la respuesta
//     const response = {
//       status: "success",
//       payload: products,
//       totalPages,
//       prevPage: page > 1 ? page - 1 : null,
//       nextPage: page < totalPages ? page + 1 : null,
//       page,
//       hasPrevPage: page > 1,
//       hasNextPage: page < totalPages,
//       prevLink:
//         page > 1
//           ? `/products?limit=${limit}&page=${page - 1}&sort=${
//               sort || ""
//             }&category=${category || ""}`
//           : null,
//       nextLink:
//         page < totalPages
//           ? `/products?limit=${limit}&page=${page + 1}&sort=${
//               sort || ""
//             }&category=${category || ""}`
//           : null,
//     };

//     res.json({ response });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// });

//Ruta que renderiza en el handlebar products
router.get("/products", productsController.getProducts);

router.get("/productDetails/:pid", productsController.productDetails);

router.get(
  "/productsManager",
  isAuthenticated,
  productsController.productsAdmin
);

router.post("/productsManager", productsController.addProductToBD);

router.put("/:uid", productsController.updateProductToDB);

router.delete("/productsManager/:uid", productsController.deleteProductToDB);

module.exports = router;
