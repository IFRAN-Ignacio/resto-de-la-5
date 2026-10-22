# El restó de la 5

Sistema del restaurante «El restó de la 5» — Proyecto integrador de **Modelos y Sistemas** (7° 2°, EEST N.º 5 «Amancio Williams»).

**Equipo:** Exequiel Garcia Kraglievich (Scrum Master) · Ignacio Ifran Videla (Product Owner) · Lionel Lauman Monzon · Lautaro Firpo

**Tecnologías:** HTML, CSS y JavaScript · Node.js + Express (API REST) · MySQL

## Estado (Sprint 1)

| Historia | Estado |
|---|---|
| US2.2 Gestionar la carta de platos | Funcionando: alta, edición, desactivación y carta agrupada por categoría |
| US1.1 Iniciar sesión según rol | Pendiente |
| US1.2 Gestionar el personal | Pendiente |
| US2.1 Gestionar mesas | Pendiente |

## Cómo correrlo (Windows + XAMPP)

1. Abrí el **XAMPP Control Panel** y tocá **Start** en **MySQL**.
2. Abrí una terminal en esta carpeta y ejecutá, una sola vez:
   ```
   npm install
   npm run db:init
   ```
   `db:init` crea la base `resto_de_la_5`, las tablas `categoria` y `plato` y carga platos de ejemplo.
3. Iniciá el servidor:
   ```
   npm start
   ```
4. Abrí **http://localhost:3000** (panel) o **http://localhost:3000/carta.html** (carta).

Si tu MySQL tiene contraseña, iniciá con `set DB_PASSWORD=tuclave` antes de `npm run db:init` y `npm start`.

## Estructura

```
backend/
  server.js                 Servidor Express: sirve la API y el frontend
  config.js                 Datos de conexión (por defecto los de XAMPP)
  db.js                     Pool de conexiones a MySQL
  modelos/Plato.js          Clase Plato (validaciones de la historia US2.2)
  modelos/Categoria.js      Clase Categoria
  servicios/GestorCarta.js  Operaciones de la carta (listar, crear, modificar, desactivar)
  rutas/carta.rutas.js      Endpoints de la API
database/
  schema.sql                Tablas categoria y plato + datos de ejemplo
  init.js                   Script que ejecuta schema.sql
frontend/
  index.html                Panel del administrador
  carta.html                Pantalla de la carta de platos
  css/estilos.css           Estilos (responsive)
  js/carta.js               Lógica de la pantalla
```

## API

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/categorias` | Lista las categorías |
| GET | `/api/carta` | Platos activos agrupados por categoría (`?todos=1` incluye desactivados) |
| POST | `/api/platos` | Crea un plato (valida nombre, categoría y precio > 0) |
| PUT | `/api/platos/:id` | Modifica un plato |
| PATCH | `/api/platos/:id/desactivar` | Desactiva un plato (no se borra, se conserva el historial) |
| PATCH | `/api/platos/:id/activar` | Lo vuelve a activar |

Documentación UML y diagramas: carpeta `diagramas` del repositorio.
