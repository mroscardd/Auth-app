# Auth App

Microservicio de autenticación y gestión de usuarios construida con **Node.js + Express + MongoDB** en el backend y un pequeño frontend para probar la API con **React + Vite**

Incluye registro, inicio de sesión con JWT en cookies `httpOnly`, sesiones persistentes ("recordarme") con selector:validator, roles (`user`, `admin`, `superadmin`) y un panel de administración para listar, paginar, cambiar el rol y eliminar usuarios.

---

## Tabla de contenidos

- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Utilidades de base de datos](#utilidades-de-base-de-datos)
- [Modelo de datos](#modelo-de-datos)
- [API](#api)
- [Roles y permisos](#roles-y-permisos)
- [Flujo de autenticación](#flujo-de-autenticación)
- [Solución de problemas](#solución-de-problemas)

---

## Características

- Registro de usuarios con validación básica y contraseñas hasheadas con `bcrypt`.
- Login con JWT almacenado en una cookie `httpOnly` (no accesible desde JavaScript).
- Opción **"Mantener sesión activa"** con sesión persistente de 30 días mediante cookies `selector:validator`.
- Middleware de autenticación y autorización por roles.
- Panel de gestión de usuarios con paginación (10 usuarios por página).
- Cambio de rol y eliminación de usuarios según permisos.
- Seed de base de datos con superadmin, admin y usuarios ficticios de prueba.
- MongoDB levantado con Docker Compose.

---

## Stack tecnológico

| Capa          | Tecnologías                                                              |
| ------------- | ------------------------------------------------------------------------ |
| Frontend      | React 19, Vite 8, React Router 7, CSS                                      |
| Backend       | Node.js, Express 5, MongoDB Driver, JWT, bcrypt, cookie-parser, CORS       |
| Base de datos | MongoDB 4.4 (Docker)                                                       |
| Tooling       | npm Workspaces, ESLint                                                     |

Monorepositorio multipaquete. El repositorio usa **npm workspaces**: `BackEnd` y `FrontEnd` son paquetes independientes gestionados desde el `package.json` raíz.

---

## Estructura del proyecto

```text
Auth-app/
├── BackEnd/
│   ├── config/
│   │   └── database.js          # Conexión a MongoDB (connectDB / getDB)
│   ├── controllers/
│   │   └── authRoutes.js        # Lógica de registro, login, usuarios y roles
│   ├── middlewares/
│   │   └── auth-middleware.js   # autenticate, admin, superadmin
│   ├── models/
│   │   ├── users.js             # UserModel: consultas y escritura en "users"
│   │   └── sessions.js          # SessionModel: sesiones persistentes
│   ├── routes/
│   │   └── authRoutes.js        # Definición de endpoints /api
│   ├── utils/
│   │   └── seedData.js          # Script de poblado de la base de datos
│   ├── .env.example
│   ├── index.js                 # Punto de entrada del servidor
│   └── package.json
├── FrontEnd/
│   ├── src/
│   │   ├── components/          # Login, Registro, Navbar, ManageUsers, etc.
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Estado global de autenticación
│   │   ├── App.jsx              # Rutas de la aplicación
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── docker-compose.yml           # MongoDB en el puerto 27019
├── package.json                 # Scripts raíz y workspaces
└── README.md
```

---

## Requisitos previos

- **Node.js 22 o superior** (el backend usa `node --watch` y `--env-file`).
- **npm 10 o superior**.
- **Docker** y **Docker Compose** (recomendado para MongoDB), o una instancia de MongoDB accesible en local.

> El backend no usa Mongoose: se comunica con MongoDB mediante el driver oficial `mongodb`.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/mroscardd/Auth-app.git
cd Auth-app
```

### 2. Instalar dependencias

Desde la raíz del proyecto (instala las dependencias de ambos workspaces):

```bash
npm install
```

### 3. Levantar MongoDB

```bash
docker compose --env-file ./Backend/.env up -d

```

El `docker-compose.yml` expone MongoDB en **`localhost:27019`** con las credenciales:


### 4. Configurar las variables de entorno

Renombra los archivos de ejemplo y ajusta los valores si es necesario.

 BackEnd/.env.example ---> BackEnd/.env
 FrontEnd/.env.example ---> FrontEnd/.env


Para que funcione con el MongoDB de Docker, `BackEnd/.env` debe contener al menos:

```env
PORT=3010
MONGO_PORT=27019
MONGO_USER=your_username
MONGO_PASS=your_password
JWTSECRET=cambia_esto_por_un_secreto_largo_y_aleatorio
```

### 5. Poblar la base de datos (opcional pero recomendado)

```bash
npm run util
```

Crea el superadmin, el admin y los usuarios ficticios definidos en `BackEnd/.env`.

### 6. Arrancar la aplicación

Abre dos terminales desde la raíz:

```bash
# Terminal 1 - Backend (http://localhost:3010)
npm run back

# Terminal 2 - Frontend (http://localhost:5173)
npm run front
```

Accede a **http://localhost:5173**.

Comprobación rápida del backend:

```bash
curl http://localhost:3010/health
```

---

## Variables de entorno

### Backend (`BackEnd/.env`)

| Variable          | Obligatoria | Ejemplo                   | Descripción                                                                 |
| ----------------- | ----------- | ------------------------- | --------------------------------------------------------------------------- |
| `PORT`            | Sí          | `3010`                    | Puerto del servidor Express.                                                |
| `MONGO_PORT`      | Sí          | `27019`                   | Puerto de MongoDB (el de `docker-compose.yml`).                             |
| `MONGO_USER`      | Sí          | `root`                    | Usuario de MongoDB.                                                         |
| `MONGO_PASS`      | Sí          | `password`                | Contraseña de MongoDB.                                                      |
| `JWTSECRET`       | Sí          | `un_secreto_largo`        | Clave para firmar y verificar los JWT.                                      |
| `IP_HOST`         | No          | `http://192.168.1.129:5173` | Origen adicional permitido por CORS (útil para probar desde la LAN).      |
| `ADMIN_NAME`      | No          | `admin`                   | Nombre del admin creado por el seed.                                        |
| `ADMIN_PASS`      | No          | `admin`                   | Contraseña del admin creado por el seed.                                    |
| `ADMIN_EMAIL`     | No          | `admin@email.com`         | Email del admin creado por el seed.                                         |
| `SUPERADMIN_NAME` | No          | `superadmin`              | Nombre del superadmin creado por el seed.                                   |
| `SUPERADMIN_PASS` | No          | `admin`                   | Contraseña del superadmin creado por el seed.                               |
| `SUPERADMIN_EMAIL`| No          | `superadmin@email.com`    | Email del superadmin creado por el seed.                                    |
| `NUMERO_USUARIOS` | No          | `100`                     | Cantidad de usuarios ficticios (`user0` … `userN`) creados por el seed.     |

> La URL de conexión se construye en `BackEnd/config/database.js` como:
> `mongodb://MONGO_USER:MONGO_PASS@localhost:MONGO_PORT` y la base de datos usada es **`usersdb`**.

### Frontend (`FrontEnd/.env`)

| Variable   | Obligatoria | Ejemplo                 | Descripción                                        |
| ---------- | ----------- | ----------------------- | -------------------------------------------------- |
| `VITE_API` | Sí          | `http://localhost:3010` | URL base del backend a la que apunta el frontend.  |

> Las variables del frontend deben empezar por `VITE_` para que Vite las exponga en `import.meta.env`.

---

## Scripts disponibles

Todos se ejecutan desde la raíz del proyecto:

| Script         | Comando                                  | Descripción                                                |
| -------------- | ---------------------------------------- | ---------------------------------------------------------- |
| `npm run back` | `npm start --workspace=BackEnd`          | Inicia el backend con recarga automática (`--watch`).      |
| `npm run front`| `npm run dev --workspace=FrontEnd`       | Inicia el servidor de desarrollo de Vite.                  |
| `npm run util` | `npm run util --workspace=BackEnd`       | Ejecuta el seed de la base de datos.                       |



## Utilidades de base de datos

El acceso a MongoDB está centralizado en tres piezas:

### `BackEnd/config/database.js` — conexión y acceso

```js
import { connectDB, getDB } from './config/database.js'

await connectDB()        // abre la conexión al arrancar el servidor
const db = getDB()       // devuelve la instancia de la BD "usersdb"
const users = db.collection('users')
```

- `connectDB()`: crea el `MongoClient` y se conecta. Se llama una sola vez al iniciar el servidor.
- `getDB()`: devuelve la conexión activa para que los modelos realicen consultas.

### `BackEnd/models/users.js` — `UserModel`

Encapsula todas las operaciones sobre la colección `users`:

| Método                                        | Descripción                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| `findExistingUser({ username, email })`       | Busca un usuario por `username` o `email`.                               |
| `findAutenticatedUser({ username, email, password })` | Verifica la contraseña con `bcrypt.compare`.                     |
| `getAllUser({ page, LIMIT, user })`           | Lista paginada, excluyendo al propio usuario y a los superadmins.        |
| `getUserById(id)`                             | Busca por `ObjectId`; lanza `NO_VALID_ID` si el id no es válido.         |
| `createUser({ username, password, email })`   | Valida duplicados, hashea la contraseña y crea el usuario con rol `user`.|
| `updateUser(body, id)`                        | Actualiza campos (por ejemplo `role`) y devuelve el usuario sin password.|
| `deleteUserById(id)`                          | Elimina un usuario por id.                                              |

### `BackEnd/models/sessions.js` — `SessionModel`

Gestiona las sesiones persistentes de la colección `sessions`:

| Método                         | Descripción                                                                 |
| ------------------------------ | --------------------------------------------------------------------------- |
| `createSession(user_id)`       | Genera `selector` y `validator`, guarda el hash del validator y expira a 30 días. |
| `findUserSession(selector)`    | Recupera la sesión asociada a un selector.                                  |
| `deleteUserSession(selector)`  | Elimina la sesión (logout o sesión inválida/expirada).                      |

### `BackEnd/utils/seedData.js` — seed de datos

Script ejecutable con `npm run util`. Lee las variables del `.env` y:

1. Crea el **superadmin** si `SUPERADMIN_NAME`, `SUPERADMIN_PASS` y `SUPERADMIN_EMAIL` están definidos.
2. Crea el **admin** si `ADMIN_NAME`, `ADMIN_PASS` y `ADMIN_EMAIL` están definidos.
3. Crea `NUMERO_USUARIOS` usuarios de prueba (`user0`, `user1`, …) con contraseñas `user_pass0`, `user_pass1`, …
4. Evita duplicados comprobando previamente por `username` o `email`.

Es idempotente: puedes ejecutarlo varias veces y no duplicará usuarios existentes.

### Inspección manual con `mongosh`

```bash
# Conectarse al contenedor
docker exec -it mi_mongodb mongosh -u your_username -p your_password --authenticationDatabase admin

# Dentro de mongosh
use usersdb
db.users.find().pretty()
db.sessions.find().pretty()
```

---

## Modelo de datos

### Colección `users`

```json
{
  "_id": "ObjectId",
  "username": "string",
  "password": "hash bcrypt",
  "email": "string",
  "role": "user | admin | superadmin"
}
```

### Colección `sessions`

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId del usuario",
  "selector": "string aleatorio (16 bytes hex)",
  "validator": "hash bcrypt del validator",
  "expiresAt": "Date (30 días)"
}
```

La cookie `session` enviada al cliente contiene `selector:validator`; solo el `selector` se usa para localizar la sesión y el `validator` se compara con `bcrypt.compare`.

---

## API

Base URL: `http://localhost:3010`

| Método   | Endpoint             | Acceso                       | Descripción                                             |
| -------- | -------------------- | ---------------------------- | ------------------------------------------------------- |
| `POST`   | `/api/register`      | Público                      | Registra un usuario y crea la cookie `token`.           |
| `POST`   | `/api/login`         | Público                      | Inicia sesión. Acepta `rememberMe` para sesión larga.   |
| `GET`    | `/api/logout`        | Autenticado                  | Elimina la sesión y limpia las cookies.                 |
| `GET`    | `/api/me`            | Autenticado                  | Devuelve el usuario autenticado (`req.user`).           |
| `GET`    | `/api/users`         | Autenticado + admin          | Lista usuarios paginados (`?page=1`, 10 por página).    |
| `PUT`    | `/api/user-role/:id` | Autenticado + admin          | Cambia el rol de un usuario.                            |
| `DELETE` | `/api/users/:id`     | Autenticado + superadmin     | Elimina un usuario.                                      |
| `GET`    | `/health`            | Público                      | Health check: estado del servicio y uptime.             |

Ejemplo de login:

```bash
curl -i -X POST http://localhost:3010/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

Las respuestas de autenticación usan cookies, por lo que el frontend siempre envía las peticiones con `credentials: 'include'`.

### Códigos de error habituales

| Código | Significado                                                            |
| ------ | ---------------------------------------------------------------------- |
| `400`  | `userId` con formato inválido (`NO_VALID_ID`).                         |
| `401`  | No autenticado, credenciales incorrectas o sesión expirada/inválida.  |
| `403`  | Sin permisos suficientes para el rol requerido.                        |
| `404`  | Usuario no encontrado.                                                 |
| `409`  | Usuario/email ya existente o intento de modificar un rol protegido.    |
| `500`  | Error interno o problema de base de datos.                             |

---

## Roles y permisos

| Rol         | Puede                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| `user`      | Registrarse, iniciar sesión, consultar `/api/me` y cerrar sesión.                       |
| `admin`     | Todo lo anterior + listar usuarios y cambiar roles (no puede modificar a otros admins ni superadmins, ni sus propios permisos). |
| `superadmin`| Todo lo anterior + eliminar usuarios y asignar el rol `superadmin`.                     |

Los permisos se aplican con los middlewares de `BackEnd/middlewares/auth-middleware.js`:

- `autenticate`: valida el JWT, el refresh token o la sesión persistente y rellena `req.user`.
- `admin`: permite `admin` y `superadmin`.
- `superadmin`: solo permite `superadmin`.

---

## Flujo de autenticación

1. **Registro / login normal:** el backend firma un JWT con `{ id, username, email, role }` (expira en 24 h) y lo guarda en la cookie `httpOnly` `token`.
2. **Login con "recordarme":** además del JWT, se crea una sesión persistente de 30 días en MongoDB y se envía la cookie `session` con formato `selector:validator`.
3. **Peticiones autenticadas:** `autenticate` verifica primero `token`. Si no existe, usa `refreshToken`; si tampoco, valida la cookie `session` contra la colección `sessions`, comprueba la expiración y compara el validator con bcrypt. Si la sesión es válida, emite un `refreshToken` de 24 h.
4. **Logout:** elimina la sesión de MongoDB y limpia las cookies `token` y `session`.

> Las cookies se configuran con `httpOnly: true` y `sameSite: 'strict'`. En producción sobre HTTPS conviene añadir `secure: true`.

---

## Solución de problemas

- **Error de conexión a MongoDB:** comprueba que el contenedor está levantado (`docker ps`) y que `MONGO_PORT`, `MONGO_USER` y `MONGO_PASS` coinciden con `docker-compose.yml`.
- **El backend no arranca:** verifica que existe `BackEnd/.env`. El script `npm start` usa `--env-file=.env` y falla si el archivo no existe.
- **CORS bloquea las peticiones:** el backend solo permite `http://localhost:5173` y el valor de `IP_HOST`. Si accedes desde otra IP o puerto, añádelo a `IP_HOST`.
- **No aparecen usuarios en el panel:** ejecuta `npm run util` y asegúrate de haber iniciado sesión con un usuario `admin` o `superadmin`.
- **Sesión que no persiste:** revisa que el frontend use `credentials: 'include'` y que `VITE_API` apunte al puerto correcto del backend.
- **Puerto ocupado:** cambia `PORT` en `BackEnd/.env` y actualiza `VITE_API` en `FrontEnd/.env`.

---

## Notas

- El nombre de la base de datos (`usersdb`) y el host de MongoDB (`localhost`) están fijados en `BackEnd/config/database.js` y `BackEnd/utils/seedData.js`. Para usar un MongoDB remoto o un nombre de base de datos distinto, edita esos archivos.
- `BackEnd/.env` y `FrontEnd/.env` están ignorados por Git. No subas secretos al repositorio; usa los `.env.example` como plantilla.
- El proyecto no incluye tests automatizados actualmente.
