import express from "express";
import exphbs from "express-handlebars";
import "./database.js";
import ProductModel from "./models/product.model.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de rutas estáticas
app.use(express.static("./src/public"));

// Configuración de Handlebars con helpers
app.engine("handlebars", exphbs.engine({
    helpers: {
        multiply: (a, b) => a * b,
        eq: (v1, v2) => v1 === v2
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas - el orden es importante
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Función para inicializar productos
async function inicializarProductos() {
    try {
        const productosExistentes = await ProductModel.find();
        
        if (productosExistentes.length === 0) {
            const productosIniciales = [
                {
                    title: "Guitarra Eléctrica Fender Stratocaster",
                    description: "Guitarra eléctrica clásica, cuerpo de aliso, acabado sunburst, 22 trastes",
                    price: 1299.99,
                    code: "GUIT001",
                    stock: 15,
                    category: "Guitarras",
                    status: true
                },
                {
                    title: "Piano Digital Yamaha P-125",
                    description: "Piano digital de 88 teclas con sonido Pure CF y polifonía de 192 notas",
                    price: 699.99,
                    code: "PIAN001",
                    stock: 8,
                    category: "Pianos",
                    status: true
                },
                {
                    title: "Batería Acústica Pearl Export",
                    description: "Kit completo de batería con bombo de 22', tarola y 3 toms",
                    price: 899.99,
                    code: "BAT001",
                    stock: 5,
                    category: "Baterías",
                    status: true
                },
                {
                    title: "Bajo Eléctrico Ibanez SR500",
                    description: "Bajo de 4 cuerdas, cuerpo de caoba, pastillas Bartolini",
                    price: 749.99,
                    code: "BAJ001",
                    stock: 12,
                    category: "Bajos",
                    status: true
                },
                {
                    title: "Saxofón Alto Yamaha YAS-280",
                    description: "Saxofón alto en Mi♭, acabado dorado, incluye estuche",
                    price: 1099.99,
                    code: "SAX001",
                    stock: 6,
                    category: "Viento",
                    status: true
                },
                {
                    title: "Violín Stradella MV1411",
                    description: "Violín 4/4 de estudio, tapa de abeto, incluye arco y estuche",
                    price: 299.99,
                    code: "VIO001",
                    stock: 20,
                    category: "Cuerdas",
                    status: true
                }
            ];

            await ProductModel.insertMany(productosIniciales);
            console.log("Productos iniciales agregados");
        }
    } catch (error) {
        console.error("Error al inicializar productos:", error);
    }
}

// Iniciamos el servidor después de inicializar los productos
async function iniciarServidor() {
    await inicializarProductos();
    
    app.listen(PUERTO, () => {
        console.log(`Servidor escuchando en el puerto ${PUERTO}`);
    });
}

iniciarServidor();