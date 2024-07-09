const cartManager = require("../dao/classes/cart.dao.js");
const cartModel = require("../dao/models/cart.model.js");
const cartService = new cartManager();

exports.getcarts = async (req, res) => {
  try {
    let carts = await cartService.getCarts();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.error("No se encuentas carritos en la Base de datos", error);
  }
};

exports.addCart = async (req, res) => {
  await cartService.addCart();
  let carts = await cartService.getCarts();
  console.log("Carrito creado correctamente");
  res.send({ result: "success", payload: carts });
};

exports.getCartById = async (req, res) => {
  let { cid } = req.params;

  try {
    let cart = await cartService.getCartByIdPopulate(cid);
    res.render("cart", { cart, style: "cart.css", title: "Carrito" });
  } catch (error) {
    res.status(500).send("Error al obtener el carrito");
  }
};

exports.addToCart = async (req, res) => {
  let { cid, pid } = req.params;
  let user = req.session.user;
  try {
    if (user.rol === "admin") {
      res.send({
        message:
          "Usted es administrador, no puede agregar productos al carrito",
      });
    }
    if (user.rol === "user") {
      await cartService.addToCart(pid, cid);
      res.redirect("/products");
    }
  } catch (error) {
    console.error("No se puede agregar el producto", error);
    res.status(500).send("Error de conexión");
  }
};

exports.deleteProduct = async (req, res) => {
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
      if (existProduct.quantity >= 1) {
        existProduct.quantity--;
        let result = await cartModel.updateOne(
          { _id: cid },
          { products: cart.products }
        );
        if (existProduct.quantity === 0) {
          cart.products = cart.products.filter(
            (p) => p.product.toString() !== pid
          );
        }

        await cart.save();

        res.redirect(`/carts/${cid}`);
      }
    }
  } catch (error) {
    res.status(504).send(error);
  }
};
