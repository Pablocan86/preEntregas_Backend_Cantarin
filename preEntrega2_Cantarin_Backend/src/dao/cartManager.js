const cartModel = require("../dao/models/cart.model.js");
const productModel = require("../dao/models/product.model.js");

class CartManager {
  constructor() {}

  async addCart() {
    const carts = await cartModel.find();
    const newCart = { products: [] };
    await cartModel.create({ newCart });
    console.log("Carrito creado correctamente");
  }

  //Método para ir agrendo productos a los carritos, el primer parámetro es el id del producto de Products.json
  //el segúndo parámetro es el id del carrito que pretendo agregar el producto
  async addToCart(idP, idC) {
    try {
      //Variable que toma el producto utilizando el método addProduct()
      const cart = await cartModel.findOne({ _id: idC });
      const product = await productModel.findOne({ _id: idP });

      const quantity = 1;
      if (cart) {
        if (product) {
          cart.products.push({ product: product, quantity: 1 });
          let result = await cartModel.updateOne({ _id: idC }, cart);
        } else {
          console.log("No existe producto");
        }
      } else {
        console.log("Carrito no existe");
      }

      console.log(product, cart);
      // //Variables que contiene todos los carritos
      // const carts = await this.readCart();
      // //Busco si existe el carrito
      // const existCart = carts.find((cart) => cart.id === idC);
      // //Validación para crear un carrito si no existe, si existe agrega productos a ese carrito
      // //y si existe producto suma cantidad
      // if (!existCart) {
      //   //Variable que me permite no repetir los id
      //   const ultimoId =
      //     carts.length > 0 ? Math.max(...carts.map((cart) => cart.id)) : 0;
      //   //Estruvtura del nuevo carrito
      //   const newCart = {
      //     id: idC || ultimoId + 1,
      //     products: [{ product: product, quantity: 1 }],
      //   };
      //   carts.push(newCart);
      //   await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
      // }
      // //Caso en el que existe el carrito
      // if (existCart) {
      //   //Busco indice del carrito existente
      //   const cartIndex = carts.findIndex((cart) => cart.id === idC);
      //   //Busco si existe el producto en ese carrito existente
      //   const existingProductIndex = carts[cartIndex].products.findIndex(
      //     (prod) => prod.product === idP
      //   );
      //   //Si carrito tiene producto le sumo la cantidad, sino crea otro objeto de producto y cantidad
      //   if (existingProductIndex !== -1) {
      //     carts[cartIndex].products[existingProductIndex].quantity++;
      //   } else {
      //     carts[cartIndex].products.push({ product: product, quantity: 1 });
      //   }
      //   await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
      // }
    } catch (error) {
      console.error("No se puede agregar producto o crear carrito", error);
    }
  }
  //Este metodo agrega producto por id, me sirve para el método de arriba
  async addProduct(id) {
    try {
      const bd = await this.readBD();
      const existProduct = bd.find((prod) => prod.id === id);
      if (existProduct) {
        return existProduct.id;
      } else {
        console.log(`Producto con id: ${id} inexistente`);
      }
    } catch (error) {
      console.error("No existe producto en la base de datos", error);
    }
  }
  async deleteCart(id) {
    let cart = await cartModel.findById(id);

    if (cart) {
      await cartModel.deleteOne({ _id: id });
      console.log("Carrito borrado correctamente");
    } else {
      throw Error("No se encuentra carrito con es id en la base de datos");
    }
  }
}

module.exports = CartManager;
