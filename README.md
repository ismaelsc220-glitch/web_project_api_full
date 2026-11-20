# Around the U.S.

Aplicación web full stack para compartir fotografías de lugares. Cada persona puede crear una cuenta, personalizar su perfil, publicar tarjetas con fotos y dar «me gusta» a las publicaciones de la galería.

Proyecto de Ismael Salazar, desarrollado durante el Sprint 19 de TripleTen. Integré una interfaz en React con una API REST propia, persistencia en MongoDB y un despliegue HTTPS en Google Cloud.

[Probar la aplicación](https://around-sprint19.ddnsfree.com/signup) · [Consultar la API](#api-rest)



## Funcionalidades

- Registro con correo electrónico, inicio y cierre de sesión.
- Edición del nombre, la descripción y el avatar del perfil.
- Galería de tarjetas con vista ampliada de las fotografías.
- Publicación de tarjetas mediante un nombre y una URL de imagen. Solo su propietario puede eliminarlas.
- Posibilidad de dar y quitar «me gusta». Los perfiles, tarjetas y reacciones se guardan en MongoDB.

## Tecnologías y decisiones técnicas

| Área | Implementación |
| --- | --- |
| Interfaz | React, React Router y Vite. Diseño adaptable, rutas protegidas y consumo de la API con Fetch. |
| API y datos | Node.js, Express, MongoDB y Mongoose. Las rutas, los controladores, los modelos y los middlewares se organizan en módulos separados. |
| Autenticación y permisos | Contraseñas con hash de bcrypt y tokens JWT con vigencia de siete días. El middleware verifica el token y el controlador comprueba la propiedad de una tarjeta antes de eliminarla. |
| Validación y errores | Celebrate, Joi y validator validan los datos de entrada. Un middleware central devuelve errores JSON con el campo `message`. |
| Registro de actividad | Winston escribe registros JSON en `backend/request.log` y `backend/error.log`. |
| Despliegue | Google Compute Engine, Nginx como servidor estático y proxy inverso, PM2 para supervisar Node.js y Certbot con Let's Encrypt para HTTPS. |

## Arquitectura y despliegue

En producción, Nginx sirve el frontend compilado y reenvía las solicitudes del navegador de `/api/*` a Express en el puerto `3000`, quitando el prefijo `/api`. Express utiliza la base `aroundb` del MongoDB de la VM. En desarrollo, el proxy de Vite proporciona el mismo comportamiento con `/api`.

La API también está disponible por separado en [api.around-sprint19.ddnsfree.com](https://api.around-sprint19.ddnsfree.com). Su configuración CORS permite peticiones desde los dominios HTTPS principal y `www` del frontend. Se comprobó que una petición preliminar desde el dominio principal devuelve `204` y admite `Authorization`. También se probó la renovación del certificado con `certbot renew --dry-run`.

## Ejecutar en local

Necesitas Git, Node.js 22.12 o posterior con npm y un servidor MongoDB escuchando en `localhost:27017`.

Clona el repositorio:

```bash
git clone https://github.com/ismaelsc220-glitch/web_project_api_full.git
cd web_project_api_full
```

Desde la raíz, inicia el backend en una terminal:

```bash
cd backend
npm ci
npm run dev
```

Desde la raíz, inicia el frontend en otra terminal:

```bash
cd frontend
npm ci
npm run dev
```

Abre [localhost:5173](http://localhost:5173). Los registros y las tarjetas creados en local se guardan en el MongoDB de tu equipo.

En desarrollo se puede ejecutar sin `.env`. En producción, configura `NODE_ENV=production` y un `JWT_SECRET` aleatorio en el entorno del backend o en un archivo `backend/.env` privado. El secreto es obligatorio en producción.

Ejecuta `npm run lint` desde cada carpeta para revisar el código. Para generar los archivos estáticos, ejecuta `npm run build` desde `frontend/`. El resultado queda en `frontend/dist/`.

## API REST

Las rutas se muestran tal como se exponen en el subdominio de la API. `POST /signin` devuelve un token que debe enviarse como `Authorization: Bearer <token>` en las rutas protegidas.

| Método y ruta | Acción | Acceso |
| --- | --- | --- |
| `POST /signup` | Registrar una cuenta | Público |
| `POST /signin` | Iniciar sesión y obtener un JWT | Público |
| `GET /users` · `GET /users/:userId` | Consultar usuarios | JWT |
| `GET /users/me` | Consultar el perfil actual | JWT |
| `PATCH /users/me` · `PATCH /users/me/avatar` | Actualizar el perfil o el avatar | JWT |
| `GET /cards` · `POST /cards` | Consultar la galería o publicar una tarjeta | JWT |
| `DELETE /cards/:cardId` | Eliminar una tarjeta propia | JWT y propietario |
| `PUT /cards/:cardId/likes` · `DELETE /cards/:cardId/likes` | Dar o quitar «me gusta» | JWT |

Los errores devuelven un objeto JSON con `message` y el estado correspondiente. La API usa `400` para datos inválidos, `401` para problemas de autenticación, `403` para acciones sin permiso, `404` para recursos inexistentes, `409` para correos duplicados y `500` para errores imprevistos.

## Prueba de recuperación con PM2

`GET /crash-test` es una ruta temporal para la revisión académica. Para habilitarla, configura `CRASH_TEST_TOKEN` con un valor aleatorio en el entorno del backend y reinicia el proceso. Desde la VM, envía ese valor en el encabezado `X-Crash-Test-Token` a `http://127.0.0.1:3000/crash-test`. La conexión se interrumpe cuando Node.js termina. Comprueba en `pm2 list` que aumentó el contador de reinicios y que `around-api` vuelve a estar `online`. Una nueva petición a `/users` sin JWT debe devolver `401`.

La ruta solo se registra si se configura el token. Después de la revisión, elimina la variable y la ruta temporal.

## Estructura

- `frontend/` contiene la interfaz React, los componentes y el cliente de la API.
- `backend/` contiene Express, los controladores, los modelos y los middlewares.
