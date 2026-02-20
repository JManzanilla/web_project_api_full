require("dotenv").config(); // 1. Carga variables de entorno (.env)
const express = require("express");
const mongoose = require("mongoose");
const { login, createUser } = require("./controllers/users"); // Importamos auth
const auth = require("./middlewares/auth"); // Importamos el guardia

const app = express();
const { PORT = 3000 } = process.env;

// 2. LISTA DE DOMINIOS PERMITIDOS (CORS)
const allowedCors = [
  "https://around-projects.duckdns.org",
  "http://around-projects.duckdns.org",
  "https://api-around.duckdns.org",
  "http://api-around.duckdns.org",
  "http://localhost:3000",
  "http://localhost:5173",
];

// 3. MIDDLEWARES DE BASE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. CONFIGURACIÓN DE CORS (Tu lógica actual)
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const requestHeaders = req.headers["access-control-request-headers"];

  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }

  next();
});

// 5. CONEXIÓN A MONGODB
mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/aroundb")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error de conexión a MongoDB:", error));

// --- SECCIÓN DE RUTAS ---

// 6. RUTAS PÚBLICAS (No requieren token)
app.post("/signin", login); // Inicia sesión
app.post("/signup", createUser); // Registra usuario nuevo

// 7. PROTECCIÓN GLOBAL (Middleware de Autenticación)
// A partir de aquí, todas las rutas debajo requieren el Token JWT
app.use(auth);

// 8. RUTAS PROTEGIDAS
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

// ------------------------

// 9. MANEJO DE RUTAS NO ENCONTRADAS (404)
app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});

// 10. MANEJADOR DE ERRORES CENTRALIZADO (Al final absoluto)
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.error(err);
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "Se ha producido un error en el servidor" : message,
  });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
