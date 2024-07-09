const cartManager = require("../dao/classes/cart.dao.js");
const cartModel = require("../dao/models/cart.model.js");
const productManager = require("../dao/classes/product.dao.js");
const productModel = require("../dao/models/product.model.js");
const crypto = require("crypto");
const ticketModel = require("../dao/models/ticket.model.js");
const cartService = new cartManager();
const productService = new productManager();
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
    let cartSimple = await cartService.getCartById(cid);
    console.log(cart);
    res.render("cart", {
      cart,
      totalPrice: cartSimple.total,
      style: "cart.css",
      title: "Carrito",
    });
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
    const cart = await cartService.getCartById(cid);
    const product = await productService.getProductById(pid);
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
        existProduct.totalPrice = existProduct.quantity * product.price;
        cart.total = cart.total - product.price;
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

exports.checkout = async (req, res) => {
  try {
    let { cid } = req.params;
    console.log(req.session.user);
    let finalyCart = await cartService.getCartById(cid);
    let cartPopulate = await cartService.getCartByIdPopulate(cid);
    let codeCrypto = crypto.randomBytes(10).toString("hex");
    let code = `${req.session.user.last_name}__${codeCrypto}`;
    //USAR UN SERVICE
    let ticket = {
      code: code,
      purchase_dateTime: new Date(),
      amount: finalyCart.total,
      purchaser: req.session.user.email,
    };
    // await ticketModel.create(ticket)

    res.render("checkout", ticket);
  } catch (error) {
    res.sendStatus(504).send(error);
  }
};
