# Around The U.S. — Full Stack

Aplicación full stack completa de la plataforma Around. Integra el backend Express con autenticación JWT real y el frontend React en un solo repositorio, representando la versión de producción del proyecto.

## Descripción

Around API Full es la integración final del proyecto Around: un backend Node.js con autenticación real mediante bcrypt y JWT, combinado con el frontend React. Los usuarios pueden registrarse, iniciar sesión y gestionar su perfil y tarjetas de forma segura.

## Tecnologías utilizadas

### Backend (`/backend`)
- Node.js 18+
- Express 5
- MongoDB + Mongoose 8
- bcryptjs — hash seguro de contraseñas
- jsonwebtoken (JWT) — autenticación con tokens
- dotenv — variables de entorno
- validator — validación de datos de entrada
- Nodemon (desarrollo)

### Frontend (`/frontend`)
- React 19
- Vite 7
- React Router DOM 7
- JavaScript ES6+
- CSS3 con metodología BEM

## Estructura del proyecto

```
web_project_api_full/
├── backend/
│   ├── app.js
│   ├── controllers/
│   │   ├── users.js     # Registro, login y gestión de perfil
│   │   └── cards.js     # CRUD de tarjetas
│   ├── middlewares/
│   │   └── auth.js      # Verificación de JWT en cada petición
│   ├── models/
│   │   ├── user.js      # Esquema con email + passwordHash
│   │   └── card.js
│   ├── routes/
│   │   ├── users.js
│   │   └── cards.js
│   ├── utils/
│   │   └── validator.js
│   └── .env             # Variables de entorno (no incluido en el repo)
└── frontend/
    ├── src/
    │   ├── AppRouter.jsx
    │   ├── components/
    │   ├── contexts/
    │   ├── utils/
    │   │   ├── Api.js
    │   │   ├── auth.js
    │   │   └── token.js
    │   └── blocks/
    └── vite.config.js
```

## Instalación y uso

### Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `/backend`:

```env
JWT_SECRET=tu_clave_secreta_aqui
MONGODB_URI=mongodb://localhost:27017/aroundb
PORT=3000
```

```bash
npm run dev     # Desarrollo con nodemon
npm start       # Producción
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # Servidor de desarrollo en http://localhost:5173
npm run build   # Build de producción
```

## Endpoints del backend

### Autenticación (pública)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/signup` | Registrar nuevo usuario |
| POST | `/signin` | Iniciar sesión, devuelve JWT |

### Usuarios (requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users/me` | Perfil del usuario actual |
| PATCH | `/users/me` | Actualiza nombre y descripción |
| PATCH | `/users/me/avatar` | Actualiza el avatar |

### Tarjetas (requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/cards` | Lista todas las tarjetas |
| POST | `/cards` | Crea una tarjeta |
| DELETE | `/cards/:cardId` | Elimina una tarjeta propia |
| PUT | `/cards/:cardId/likes` | Agrega un like |
| DELETE | `/cards/:cardId/likes` | Elimina un like |

## Evolución del proyecto

Este repositorio es la etapa final de una serie de proyectos:

1. [web_project_around](https://github.com/JManzanilla/web_project_around) — Vanilla JS
2. [web_project_around_express](https://github.com/JManzanilla/web_project_around_express) — Backend sin auth
3. [web_project_around_react](https://github.com/JManzanilla/web_project_around_react) — Frontend React
4. [web_project_around_auth](https://github.com/JManzanilla/web_project_around_auth) — Frontend con auth JWT
5. **web_project_api_full** — Integración completa

## Autor

Jesus Manzanilla — [GitHub](https://github.com/JManzanilla)
