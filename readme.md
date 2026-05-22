# Nenemi — Plataforma de Turismo Cultural Mexicano

Aplicación web para explorar y gestionar destinos turísticos de México. Incluye galería pública de destinos, autenticación de usuarios con JWT y panel de administración protegido.

---

## Tecnologías

| Capa | Stack |
|---|---|
| Frontend | HTML, CSS, JavaScript vanilla |
| Backend | Node.js, Express 5, Mongoose |
| Base de datos | MongoDB Atlas |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Seguridad | helmet, CORS restringido, rate limiting |

---

## Estructura del proyecto

```
Nenemi_A_full_Version/
├── frontend/
│   ├── index.html              # Página principal (galería de destinos)
│   ├── main.js                 # Lógica de sesión y carga de componentes
│   ├── admin.html              # Panel de administración (solo admins)
│   ├── admin.js
│   ├── login_usuarios/
│   │   ├── login.html
│   │   └── login.js
│   ├── registro_usuarios/
│   │   ├── registro.html
│   │   └── registro.js
│   ├── reutilizables/          # Navbar y footer compartidos
│   ├── css/
│   └── img/
└── backend/
    ├── index.js                # Entrada: conecta BD e inicia servidor
    ├── app.js                  # Express app (rutas, middlewares)
    ├── models.js               # Modelos Mongoose (Destino, Usuario)
    ├── tests/
    │   └── api.test.js
    ├── .env                    # Variables de entorno (NO subir a git)
    └── .env.example            # Plantilla de variables de entorno
```

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd Nenemi_A_full_Version/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y rellena los valores:

```bash
cp .env.example .env
```

```env
MONGO_URI=mongodb+srv://USUARIO:CONTRASENA@host/base-de-datos
JWT_SECRET=clave-secreta-larga-y-aleatoria
SETUP_SECRET=clave-para-promover-admin
PORT=3000
CORS_ORIGIN=http://localhost:5500
```

### 4. Iniciar el servidor

```bash
npm run dev    # Desarrollo con recarga automática
npm start      # Producción
```

### 5. Abrir el frontend

Abre `frontend/index.html` con un servidor estático (p.ej. Live Server en VS Code).

---

## API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | — | Estado del servidor |
| GET | `/api/destinos` | — | Lista de destinos |
| POST | `/api/destinos` | Admin | Crear destino |
| DELETE | `/api/destinos/:id` | Admin | Eliminar destino |
| POST | `/api/registro` | — | Registrar usuario |
| POST | `/api/login` | — | Login, devuelve JWT |
| POST | `/api/setup-admin` | SETUP_SECRET | Promover usuario a admin |

Las rutas de **Admin** requieren el header:
```
Authorization: Bearer <token>
```

---

## Promover el primer admin

1. Registra tu cuenta normalmente en el frontend.
2. Haz un POST a `/api/setup-admin`:

```bash
curl -X POST https://tu-dominio.com/api/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "tu@correo.com", "setupSecret": "TU_SETUP_SECRET"}'
```

3. Una vez promovido, **elimina la ruta `/api/setup-admin`** del código por seguridad.

---

## Tests

```bash
npm test
```

Los tests usan Jest + Supertest con mocks de los modelos de Mongoose. No requieren conexión a MongoDB.

---

## Despliegue en producción (Render)

1. Sube el código a GitHub.
2. Crea un nuevo **Web Service** en [Render](https://render.com) apuntando a la carpeta `backend/`.
3. Configura las variables de entorno en el panel de Render (las mismas del `.env`).
4. El frontend puede servirse desde Render Static Sites o cualquier CDN.
