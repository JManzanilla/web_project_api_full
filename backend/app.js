const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// 1. Lista de dominios permitidos
const allowedCors = [
  "https://api-around.duckdns.org",
  "http://api-around.duckdns.org",
  "https://tu-frontend-usuario.github.io", // Agrega aquí la URL de tu futuro frontend
  "http://localhost:3000",
  "http://localhost:3001",
];

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Implementación de Middleware CORS
app.use((req, res, next) => {
  const { origin } = req.headers; // Origen de la solicitud
  const { method } = req; // Método HTTP
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const requestHeaders = req.headers["access-control-request-headers"];

  // Comprobar si el origen está permitido
  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // Permite el acceso desde este origen
  }

  // Manejo de solicitudes preflight (OPTIONS)
  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS); // Métodos permitidos
    res.header("Access-Control-Allow-Headers", requestHeaders); // Encabezados permitidos
    return res.end(); // Termina el procesamiento de la solicitud preliminar
  }

  next();
});

// Conectar a MongoDB
mongoose
  .connect("mongodb://localhost:27017/aroundb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error de conexión a MongoDB:", error));

// Importar rutas
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

// Middleware de usuario de prueba
app.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

// Usar rutas
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// 404 personalizado
app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Manejador de errores centralizado
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Se ha producido un error en el servidor" });
});
