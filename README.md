Around (Proyecto Full Stack) - Despliegue en la Nube
Esta es una aplicación interactiva que permite a los usuarios compartir fotos, dar "me gusta" a las imágenes de otros y editar su perfil. El proyecto representa la culminación del aprendizaje en desarrollo Full Stack, abarcando desde el diseño de la interfaz hasta la configuración de servidores en la nube.

🚀 Tecnologías Utilizadas
Frontend: React, React Router, Context API, Vite.

Backend: Node.js, Express.js.

Base de Datos: MongoDB & Mongoose.

Infraestructura: Google Cloud Platform (VM Instance), Nginx.

Seguridad: Autenticación JWT, Encriptación con Bcrypt, Certificados SSL (Certbot/Let's Encrypt).

🛠️ Proceso de Montaje y Despliegue
El despliegue se realizó desde cero en una instancia de Google Cloud (Ubuntu). Los pasos clave incluyeron:

1. Configuración de la VM e Infraestructura
Instalación y configuración de Node.js y NPM.

Configuración de MongoDB para el almacenamiento persistente de datos.

Uso de PM2 para mantener el servidor de Node.js corriendo en segundo plano de forma ininterrumpida.

2. Backend y API
Desarrollo de una API RESTful con rutas protegidas.

Implementación de controladores para usuarios y tarjetas.

Configuración de políticas de CORS para permitir conexiones seguras desde el dominio del frontend.

3. Frontend y Producción
Migración de las peticiones de una API de terceros a la API propia.

Generación del Build de producción optimizado con Vite.

4. Servidor Web y Seguridad (SSL)
Configuración de Nginx como servidor web y proxy inverso para redirigir el tráfico a la aplicación.

Implementación de nombres de dominio personalizados usando DuckDNS.

Instalación de certificados de seguridad HTTPS mediante Certbot, asegurando el cifrado de datos de extremo a extremo.

🌐 Enlaces del Proyecto
Frontend: https://around-projects.duckdns.org

API: https://api-around.duckdns.org

🔑 Autenticación y Rutas
La aplicación cuenta con un flujo completo de autenticación:

POST /signup: Registro de nuevos usuarios.

POST /signin: Inicio de sesión y generación de JSON Web Token (JWT).

GET /users/me: Validación de token y recuperación de datos de perfil.

👨‍💻 Autor
Ing. Jesús Manzanilla Gómez
Full Stack Developer# Tripleten web_project_api_full
