# **REPOSITORIO PRE ENTREGAS BACKEND**

## PRIMER PRE ENTREGA

[Link del repositorio click aqui](https://github.com/Pablocan86/preEntregas_Backend_Cantarin/tree/main/preEntrega1_Cantarin_Backend)

#### Capturas de pantalla de Postmand

### BASE DE DATOS PRODUCTOS

```
GET: localhost:8080/api/products
```

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/image.png)

> _LISTA PRODUCTS CON LIMIT_

```
GET: localhost:8080/api/products/?limit=#
```

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/products_limit.png)

> _PRODUCTO POR ID_

```
GET: localhost:8080/api/products/:id
```

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/producto_id.png)

> _AGREGAR PRODUCTO AL "PRODUCTS.JSON"_

```
POST: localhost:8080/api/product
```

#### Si no existe en "Products.json"

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/agregar_producto_products.png)

#### Si existe en "Products.json"

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/producto_existente_products.png)

> _ACTUALIZACIÓN DE PRODUCTO EN "PRODUCTS.JSON"_

```
PUT: localhost:8080/api/product/:id
```

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/actualizar_producto_products.png)

> _ELIMINACION DE PRODUCTO EN "PRODUCT.JS"_

#### Existente en "Products.json"

```
DELETE: localhost:8080/api/product/:id
```

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/eliminado_products.png)

#### Inexistente en "Products.json"

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/eliminado_no_existe_products.png)

### BASE DE DATOS CARRITOS

> _CREAR UN CARRITO VACIO_

```
POST: localhost:8080/api/carts
```

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/crear_carrito.png)

#### Cart.json

![imagen visual studio](./preEntrega1_Cantarin_Backend/src/images/carrito_creado.png)

#### Se crea otro carrito con otro id

![imagen visual studio](./preEntrega1_Cantarin_Backend/src/images/otro_carrito_creado.png)

> _LISTA DE PRODUCTOS DE UN CARRITO ESPECÍFICO_

```
GET: localhost:8080/api/carts/:cid
```

#### Existe carrito

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/products_carrito.png)

#### No existe carrito

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/products_carrito_no_existe.png)

> _AGREGA PRODUCTO A CARRITO Y SUMA CANTIDAD_

```
POST: localhost:8080/api/carts/:cid/product/:pid
```

#### Si existe carrito(agrega sino tira mensaje de que no existe carrito)

![imagen postman](./preEntrega1_Cantarin_Backend/src/images/agregar_product_carrito.png)

#### Antes de agregar "Carts.json"

![imagen visual studio](./preEntrega1_Cantarin_Backend/src/images/antes_de_agregar.png)

#### Después de agregar "Carts.json"

![imagen de visual studio](./preEntrega1_Cantarin_Backend/src/images/despues_de_agregar.png)

## SEGUNDA PRE ENTREGA

[Link del repositorio click aqui](https://github.com/Pablocan86/preEntregas_Backend_Cantarin/tree/main/preEntrega2_Cantarin_Backend)

### RUTA RAIZ DEVOLUCIÓN OBJETO

```
GET: localhost:8080
```

![imagen postman](./preEntrega2_Cantarin_Backend/src/imagesReadme/ruta_raiz.png)

### FILTRO LIMIT+PAGE+SORT+CATEGORY

```
GET: localhost:8080/?limit=2&page=2&sort=asc&category=camisas
```

![imagen postman](./preEntrega2_Cantarin_Backend/src/imagesReadme/ruta_raiz_filtros.png)

### METODO POST PARA CREAR CARRITO VACIO

```
POST: localhost:8080/carts
```

### METODO DELETE PARA BORRAR PRODUCTO CARRITO

```
DELETE: localhost:8080/carts/(ID de carrito)/products/(_id de producto en carrito)
```

### METODO PUT PARA SUMAR CANTIDAD DE PRODUCTO EXISTENTE

```
PUT: localhost:8080/carts/(ID de carrito)/products/(_id de producto en carrito)
```

![imagen postman](./preEntrega2_Cantarin_Backend/src/imagesReadme/put_suma_quantity.png)
