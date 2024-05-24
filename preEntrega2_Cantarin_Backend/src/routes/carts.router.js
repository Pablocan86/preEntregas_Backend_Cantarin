const express = require("express");
const router = express.Router();
const cartModel = require("../dao/models/cart.model.js");
const productModel = require("../dao/models/product.model.js");
const CartManager = require("../dao/cartManager.js");

const cartManager = new CartManager();

router.get("/carts", async (req, res) => {
  try {
    let carts = await cartModel.find();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.error("No se encuentas carritos en la Base de datos", error);
  }
});

router.post("/carts", async (req, res) => {
  await cartManager.addCart();
  let carts = await cartModel.find();
  res.send({ result: "success", payload: carts });
});

// Muestra solo el carrito pasando el ID en params
router.get("/carts/:cid", async (req, res) => {
  try {
    let { cid } = req.params;
    let cart = await cartModel.findById(cid);
    if (cart) {
      res.send({ products: cart });
    } else {
      res.send({ message: "No existe 🛒" });
    }
  } catch (error) {
    console.error("No existe carrito");
    res.json({ message: "No existe carrito" });
  }
});

// RUTA DE LA PRIMER PRE ENTREGA PARA ADAPATAR
router.post("/carts/:cid/products/:pid", async (req, res) => {
  try {
    let { cid, pid } = req.params;
    await cartManager.addToCart(pid, cid);
    const carts = await cartModel.find();
    res.send({ carts });
    // // const db = await managerC.readBD();
    // const products = await productModel.find();
    // // const cartId = parseInt(req.params.cid);
    // const cartId = req.params.cid;
    // // const productId = parseInt(req.params.pid);
    // const productId = req.params.pid;
    // const addedProduct = products.find((prod) => prod.id === productId);
    // if (addedProduct) {
    //   const existCart = await cartModel.find({ _id: cartId });

    //   if (existCart) {
    //     res.send(
    //       `Producto ${addedProduct.title} agregado al carrito con id: ${existCart.id}`
    //     );
    //     // await managerC.addToCart(productId, cartId);
    //   } else {
    //     res.send(`No existe carrito con id ${cartId}`);
    //     return;
    //   }
    // } else {
    //   res.send(`Producto con ID: ${productId} inexistente en la base de datos`);
    // }
  } catch (error) {
    console.error("No se puede agregar el producto", error);
    res.status(500).send("Error de conexión");
  }
});

/*Ruta que agrega solo la cantidad pasada por body
{
  quantity:Number
}
*/

router.put("/carts/:cid/products/:pid", async (req, res) => {
  let quantity = req.body.quantity;

  try {
    let { cid, pid } = req.params;
    const cart = await cartModel.findById((id = cid));
    const vista = cart.products;
    const existProduct = vista.find((p) => p.id === pid);
    if (existProduct) {
      existProduct.quantity = existProduct.quantity + quantity;
      let result = await cartModel.updateOne({ _id: cid }, cart);

      res.send({ Respuesta: "Producto agregado" });
    } else {
      res.send({ Respuesta: "No existe producto en la base de datos" });
    }
  } catch (error) {
    res.status(504).send(error);
  }
});

//Ruta que borra todo el carrito

router.delete("/carts/:uid", async (req, res) => {
  let { uid } = req.params;
  try {
    await cartManager.deleteCart(uid);

    res
      .status(201)
      .json({ message: `Carrito con ID: '${uid}' borrado correctamente` });
  } catch (error) {
    if (
      error.message === "No se encuentra carrito con es id en la base de datos"
    ) {
      res.status(400).json({
        error: "No se encuentra carrito con es id en la base de datos",
      });
    } else if (error.message === "No hay carritos para borrar") {
      res.status(401).json({ error: "No hay carritos para borrar" });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
});

//Ruta que solo borra el producto del carrito seleccionado
router.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    let { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    const vista = cart.products;
    const existProduct = vista.find((p) => p.id === pid);
    if (existProduct) {
      cart.products.remove(existProduct);
      let result = await cartModel.deleteOne({ _id: pid }, cart);

      res.send({ Respuesta: "Producto borrado" });
    } else {
      res.send({ Respuesta: "No existe producto en la base de datos" });
    }
  } catch (error) {
    res.status(504).send(error);
  }
});

router.get("/vista/:cid", async (req, res) => {
  let { cid } = req.params;
  console.log(cid);
  let cart = await cartModel.find({ _id: cid }).populate("products.product");
  console.log(JSON.stringify(cart, null, "\t"));
});
module.exports = router;
