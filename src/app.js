// Importamos mongoose para conectarnos a la base de datos MongoDB.
import mongoose from "mongoose";

// Importamos el modelo OrderModel definido en order.model.js para interactuar con la colección "orders".
import OrderModel from "./models/order.model.js";

// Definimos una función principal asincrónica que manejará la conexión a la base de datos y la paginación.
const main = async () => {
    // Conectamos a MongoDB (debes agregar la URL de conexión dentro de las comillas).
    mongoose.connect("mongodb+srv://jvclases2020:coderhouse@cluster0.727im.mongodb.net/MongoAvanzado3?retryWrites=true&w=majority&appName=Cluster0");

    // Paginación: buscamos en la colección "orders" aquellos documentos cuyo campo "tam" sea "familiar".
    // Limitamos los resultados a 4 documentos por página y obtenemos la primera página.
    const resultado = await OrderModel.paginate({ "tam": "familiar" }, { limit: 4, page: 1 });

    // Mostramos el resultado en la consola.
    console.log(resultado);
}
main();

// ------------------------ Creación de un servidor con Express ------------------------

// Importamos express para manejar el servidor web.
import express from "express";

// Importamos el motor de plantillas Handlebars para renderizar vistas dinámicas.
import { engine } from "express-handlebars";

// Creamos una instancia de la aplicación Express.
const app = express();

// Definimos el puerto en el que correrá el servidor.
const PUERTO = 8080;

// Conectamos nuevamente a MongoDB (debes agregar la URL de conexión dentro de las comillas).
mongoose.connect("mongodb+srv://jvclases2020:coderhouse@cluster0.727im.mongodb.net/MongoAvanzado3?retryWrites=true&w=majority&appName=Cluster0");

// ------------------------ Middleware ------------------------

// Habilitamos el middleware para procesar datos en formato JSON en las peticiones.
app.use(express.json());

// Habilitamos el middleware para procesar datos codificados en URL (útil para formularios).
app.use(express.urlencoded({ extended: true }));

// Agregar después de la creación de la app y antes de las rutas
app.use(express.static('./src/public'));

// ------------------------ Configuración de Handlebars ------------------------

// Definimos el motor de plantillas que usará Express.
app.engine("handlebars", engine());

// Establecemos Handlebars como el motor de vistas.
app.set("view engine", "handlebars");

// Especificamos el directorio donde estarán ubicadas las vistas.
app.set("views", "./src/views");

// ------------------------ Definición de Rutas ------------------------

// Ruta para obtener una lista de pizzas con paginación.
app.get("/pizzas", async (req, res) => {
    // Obtenemos el número de página desde los parámetros de la URL; si no se proporciona, usamos la página 1 por defecto.
    const page = req.query.page || 1;

    // Definimos el límite de elementos por página.
    const limit = 2;

    // Obtenemos las pizzas paginadas desde la base de datos.
    const pizzas = await OrderModel.paginate({}, { limit, page });

    // Transformamos los documentos recuperados para eliminar el campo _id.
    const pizzasResultadoFinal = pizzas.docs.map(pizza => {
        const { _id, ...rest } = pizza.toObject(); // Convertimos el documento a objeto y eliminamos _id.
        return rest;
    });

    // Renderizamos la vista "pizzas" y enviamos los datos de paginación.
    res.render("pizzas", {
        pizzas: pizzasResultadoFinal,  // Lista de pizzas procesadas.
        hasPrevPage: pizzas.hasPrevPage,  // ¿Hay una página anterior?
        hasNextPage: pizzas.hasNextPage,  // ¿Hay una página siguiente?
        prevPage: pizzas.prevPage,  // Número de la página anterior.
        nextPage: pizzas.nextPage,  // Número de la página siguiente.
        currentPage: pizzas.page,   // Página actual.
        totalPages: pizzas.totalPages  // Total de páginas disponibles.
    });
});

// ------------------------ Inicialización del Servidor ------------------------

// Iniciamos el servidor en el puerto definido.
app.listen(PUERTO, () => {
    console.log("si si funciona"); // Mensaje de confirmación en la consola.
});
