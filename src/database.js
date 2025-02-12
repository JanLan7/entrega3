import mongoose from "mongoose";
import ProductModel from "./models/product.model.js";

try {
    await mongoose.connect("mongodb+srv://jvclases2020:coderhouse@cluster0.727im.mongodb.net/Examen?retryWrites=true&w=majority&appName=Cluster0");
    // Limpiar la colección de productos al iniciar
    await ProductModel.deleteMany({});
    console.log("Conectado a la base de datos y productos anteriores eliminados");
} catch (error) {
    console.error("Error al conectarse a la base de datos", error);
    process.exit(1);
}