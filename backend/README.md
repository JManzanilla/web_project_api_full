# Web Project Around Express
# Web Project Around — API con Express

## 📦 Descripción

API de ejemplo implementada con Node.js, Express y Mongoose que simula el backend del proyecto "Around" (tarjetas y usuarios). El objetivo es ofrecer rutas para listar, crear y modificar usuarios y tarjetas, y preparar la base para integrar autenticación y una UI en etapas posteriores.

El repositorio incluye:
- Rutas REST para `users` y `cards`.
- Validaciones en esquemas Mongoose.
- Manejo básico de errores (400, 404, 500).
- Un middleware temporal que inyecta `req.user._id` para pruebas (sustituir por autenticación real más adelante).

## 🚀 Funcionalidades principales

- Servidor Express en el puerto 3000 (configurable).
- Persistencia con MongoDB (vía Mongoose).
- Rutas principales:
  - Users: `GET /users`, `GET /users/:userId`, `POST /users`, `PATCH /users/me`, `PATCH /users/me/avatar`
  - Cards: `GET /cards`, `POST /cards`, `DELETE /cards/:cardId`, `PUT /cards/:cardId/likes`, `DELETE /cards/:cardId/likes`
- Validación de datos en modelos (name, about, avatar, link).
- Control de errores con códigos HTTP apropiados.

## Requisitos previos

- Node.js (>= 18 recomendado)
- npm
- MongoDB local corriendo (mongod) o cadena de conexión válida

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/JManzanilla/web_project_around_express.git
cd web_project_around_express
```

2. Instala dependencias:

```bash
npm install
```

3. Asegúrate de que MongoDB esté en ejecución (por defecto la app usa `mongodb://localhost:27017/aroundb`).

## Scripts útiles

- `npm start` — inicia la app (`node app.js`).
- `npm run dev` — inicia en modo desarrollo con `nodemon`.
- `npm run lint` — ejecuta ESLint.

## Configuración rápida

Por defecto la app usa la URL local de MongoDB: `mongodb://localhost:27017/aroundb`. Si necesitas usar otra cadena, puedes modificar directamente `app.js` o usar variables de entorno (mejor práctica).

## Endpoints (resumen)

Usuarios

- GET /users
  - Devuelve lista de usuarios.
- GET /users/:userId
  - Devuelve usuario por `_id`. Errores:
    - 400 si el id está mal formado.
    - 404 si no existe.
- POST /users
  - Crea usuario. Body JSON: `{ "name": "Nombre", "about": "Sobre mí", "avatar": "https://..." }`
  - 400 si datos inválidos.
- PATCH /users/me
  - Actualiza `name` y `about`. Body JSON: `{ "name": "Nuevo", "about": "Texto" }`
  - Requiere `req.user._id` (middleware temporal en `app.js`).
- PATCH /users/me/avatar
  - Actualiza `avatar`. Body JSON: `{ "avatar": "https://..." }`

Tarjetas (cards)

- GET /cards
  - Devuelve todas las tarjetas.
- POST /cards
  - Crea tarjeta. Body JSON: `{ "name": "Título", "link": "https://..." }`.
  - El `owner` se obtiene de `req.user._id` (middleware temporal).
- DELETE /cards/:cardId
  - Elimina tarjeta por id. Solo el propietario (owner) puede eliminarla.
- PUT /cards/:cardId/likes
  - Añade un like del usuario actual al array `likes` (usa `$addToSet` para evitar duplicados).
- DELETE /cards/:cardId/likes
  - Elimina el like del usuario del array `likes` (usa `$pull`).

## Manejo de errores

- 400: datos inválidos o id mal formado (CastError / ValidationError).
- 404: recurso no encontrado (se usa `.orFail()` para lanzar DocumentNotFoundError y devolver 404).
- 403: acción no permitida (p. ej. intentar eliminar una tarjeta que no eres propietario).
- 500: error interno por defecto.

Los controladores revisan `err.name` y `err.statusCode` para decidir el código HTTP apropiado.

## Middleware temporal de autorización (IMPORTANTE)

Para pruebas locales se incluye un middleware en `app.js` que inyecta un objeto `req.user` con un `_id` hard-coded. Esto permite probar la creación y eliminación de tarjetas sin implementar autenticación. Ejemplo (ya incluido en el proyecto):

```js
app.use((req, res, next) => {
  req.user = { _id: '690d3a2a77c03d9387e77211' }; // id de prueba
  next();
});
```

Sustituye o elimina este middleware cuando integres autenticación real.

## Insertar usuario de prueba (opcional)

Si quieres que el `owner` referencie a un usuario real en la colección `users`, puedes crear un usuario con el `_id` de prueba usando la consola de Mongo o un script de seed. Ejemplo con la consola de mongo:

```js
use aroundb
db.users.insertOne({
  _id: ObjectId("690d3a2a77c03d9387e77211"),
  name: 'Usuario Prueba',
  about: 'Test',
  avatar: 'https://example.com/avatar.jpg'
});
```

O crear un script `scripts/seed-user.js` que use Mongoose (puedo añadirlo si lo deseas).

## Estructura del proyecto (resumen)

```
web_project_around_express/
├─ app.js                 # Punto de entrada, conexión a MongoDB, middlewares y rutas
├─ package.json
├─ routes/
│  ├─ users.js
│  └─ cards.js
├─ controllers/
│  ├─ users.js
│  └─ cards.js
├─ models/
│  ├─ user.js
│  └─ card.js
├─ utils/
│  └─ validator.js       # validador de URLs reutilizable
├─ data/                 # JSON de ejemplo (si se usa en alguna versión)
└─ README.md
```

## Pruebas y verificación

Usa Postman, curl o un script para probar los endpoints. Algunos ejemplos:

```bash
curl http://localhost:3000/users

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","about":"Dev","avatar":"https://example.com/a.jpg"}'

curl -X POST http://localhost:3000/cards \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi tarjeta","link":"https://example.com/img.jpg"}'
```

## Buenas prácticas y próximos pasos

- Reemplazar el middleware temporal por autenticación (JWT / sesiones).
- Añadir tests automatizados (jest / supertest).
- Separar la configuración (usar variables de entorno para la URI de Mongo).
- Añadir manejo centralizado de errores (middleware de error) para evitar duplicación.

---


