// Importamos mongoose, una biblioteca de Node.js para interactuar con bases de datos MongoDB.
import mongoose from "mongoose";

// Importamos el plugin mongoose-paginate-v2 para agregar funcionalidad de paginación a nuestro esquema de mongoose.
import mongoosePaginate from "mongoose-paginate-v2";

// Definimos un esquema para la colección "orders" en la base de datos.
const orderSchema = new mongoose.Schema({
    nombre: String,    // Campo 'nombre' de tipo String (nombre del producto o pedido).
    tam: String,       // Campo 'tam' de tipo String (tamaño del producto).
    precio: Number,    // Campo 'precio' de tipo Number (precio del producto).
    cantidad: Number   // Campo 'cantidad' de tipo Number (cantidad del producto en el pedido).
});

// Aplicamos el plugin mongoosePaginate al esquema 'orderSchema' para habilitar la paginación en las consultas.
orderSchema.plugin(mongoosePaginate);

// Creamos el modelo OrderModel basado en el esquema 'orderSchema' y lo asociamos con la colección "orders" en la base de datos.
const OrderModel = mongoose.model("orders", orderSchema);

// Exportamos el modelo OrderModel para poder utilizarlo en otras partes de la aplicación.
export default OrderModel;
