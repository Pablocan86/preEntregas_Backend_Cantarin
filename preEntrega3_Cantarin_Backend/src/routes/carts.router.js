const express = require("express");
const router = express.Router();
const cartModel = require("../dao/models/cart.model.js");
const productModel = require("../dao/models/product.model.js");
const CartManager = require("../dao/classes/cart.dao.js");
const cartController = require("../controllers/cartController.js");

const cartManager = new CartManager();

//Muesra todos los carritos
router.get("/carts", cartController.getcarts);

//Crea un carrito
router.post("/createcart", cartController.addCart);

//Muestra carrito con productos detallados
//(lo comento para que no tenga problemas con el otro router del handlebar)
// router.get("/carts/:cid", async (req, res) => {
//   try {
//     let { cid } = req.params;
//     let cart = await cartModel.findById(cid).populate("products.product");
//     if (cart) {
//       res.send({ products: cart });
//     } else {
//       res.send({ message: "No existe 🛒" });
//     }
//   } catch (error) {
//     console.error("No existe carrito");
//     res.json({ message: "No existe carrito" });
//   }
// });

router.get("/carts/:cid", cartController.getCartById);

router.post("/carts/:cid/products/:pid", cartController.addToCart);

/*Ruta que agrega solo la cantidades de 1 en 1 */
router.put("/carts/:cid/products/:pid", async (req, res) => {
  try {
    let { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ Respusta: "Carrito no encontrado" });
    }

    let existProduct = cart.products.find((p) => p.product.toString() === pid);

    if (!existProduct) {
      return res
        .status(404)
        .send({ Respuesta: "Producto no encontrado en el carrito" });
    } else {
      existProduct.quantity++;
      let result = await cartModel.updateOne(
        { _id: cid },
        { products: cart.products }
      );

      res.redirect(`/carts/${cid}`);
    }
  } catch (error) {
    res.status(504).send(error);
  }
});

//Prueba para acceder a los productos
// router.get("/carrito/:cid/product/:pid", async (req, res) => {
//   let { cid, pid } = req.params;
//   console.log(pid);
//   const cart = await cartModel.findById(cid);
//   const producto = cart.products.find((p) => (p.product.id = pid));
//   res.send({ producto: producto });
// });

router.delete("/carts/:cid/products/:pid", cartController.deleteProduct);

module.exports = router;
