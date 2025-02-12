import express from "express";
import ProductManager from "../managers/product-manager-db.js";
import CartManager from "../managers/cart-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 3, sort, category } = req.query;
      
      // Configurar las opciones de búsqueda
      const options = {
         page: parseInt(page),
         limit: parseInt(limit),
         sort,
         query: category ? { category } : undefined
      };

      const productos = await productManager.getProducts(options);

      res.render("products", {
         productos: productos.docs,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages,
         limit: productos.limit,
         totalDocs: productos.totalDocs,
         // Agregar los filtros actuales para mantenerlos en la paginación
         sort: sort || '',
         category: category || ''
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

router.get("/products/:pid", async (req, res) => {
   try {
      const producto = await productManager.getProductById(req.params.pid);
      
      if (!producto) {
         return res.status(404).render('error', { error: 'Producto no encontrado' });
      }

      res.render("product-detail", { 
         producto: producto.toObject(),
         title: producto.title 
      });
   } catch (error) {
      console.error("Error al obtener producto", error);
      res.status(500).render('error', { error: "Error interno del servidor" });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const carrito = await cartManager.getCarritoById(cartId);

      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productosEnCarrito = carrito.products.map(item => ({
         product: item.product.toObject(),
         //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
         quantity: item.quantity
      }));

      res.render("carts", { productos: productosEnCarrito });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});

export default router;