# The Drop - Backend

Backend de **The Drop** construido con Node.js, Express y PostgreSQL.

## Tecnologías

- **express**: Framework HTTP
- **pg**: Cliente PostgreSQL
- **jsonwebtoken**: Autenticación con JWT
- **bcryptjs**: Hash de contraseñas
- **cors**: Seguridad CORS
- **dotenv**: Variables de entorno
- **nodemon**: Reinicio automático (desarrollo)
- **morgan**: Logger HTTP

## Instalación y Setup

### 1. Clonar y navegar al backend
```bash
cd backend
npm install
```

### 2. Configurar PostgreSQL

1. Descargar PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Ejecutar el instalador y seguir los pasos
3. **Importante**: Recordar la contraseña del usuario `postgres`
4. Seleccionar puerto `5432` (por defecto)
5. Verificar que PostgreSQL está corriendo:
   ```cmd
   psql --version
   ```

### 3. Crear usuario y base de datos

Abre Command Prompt (cmd) o PowerShell y ejecuta:

```cmd
psql -U postgres -h localhost
```

Se pedirá la contraseña de `postgres`. Luego ejecuta:

```sql
CREATE ROLE thedrop_user WITH LOGIN PASSWORD 'admin' CREATEDB;
CREATE DATABASE thedrop_db OWNER thedrop_user;
\q
```

### 4. Cargar el schema y datos de prueba

En Command Prompt (cmd) o PowerShell:

```cmd
psql -U thedrop_user -h localhost -d thedrop_db -f backend/schema.sql
```

### 5. Crear archivo `.env`
En `backend/.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=thedrop_user
DB_PASSWORD=admin
DB_NAME=thedrop_db
JWT_SECRET=tu_secret_key_super_segura_2026
```

### 6. Iniciar el servidor
```bash
npm run server
```

El servidor estará en `http://localhost:3000`

## Endpoints

### Autenticación (`/api/auth`)

#### Registrar usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123",
  "nombre": "Juan Pérez",
  "region": "Región Metropolitana",
  "comuna": "Santiago"
}
```

#### Iniciar sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123"
}
```

#### Obtener perfil (requiere token)
```http
GET /api/auth/profile
Authorization: Bearer <TOKEN>
```

#### Actualizar perfil (requiere token)
```http
PUT /api/auth/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "nombre": "Juan Actualizado",
  "region": "Región del Biobío",
  "comuna": "Concepción",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Productos (`/api/products`)

#### Listar productos (con filtros)
```http
GET /api/products
GET /api/products?search=nike
GET /api/products?marca_id=1
GET /api/products?talla_id=6
GET /api/products?precio_min=40000&precio_max=80000
```

#### Obtener producto por ID
```http
GET /api/products/{id}
```

#### Crear producto (requiere token)
```http
POST /api/products
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "titulo": "Nike Air Force 1",
  "modelo": "AF1 Classic",
  "descripcion": "Zapatillas clásicas",
  "marca_id": 1
}
```

#### Actualizar producto (requiere token)
```http
PUT /api/products/{id}
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "titulo": "Nike Air Force 1 - Edición Especial"
}
```

#### Eliminar producto (requiere token)
```http
DELETE /api/products/{id}
Authorization: Bearer <TOKEN>
```

### Variantes (`/api/products/{productId}/variantes`)

#### Obtener variantes de un producto
```http
GET /api/products/1/variantes
```

#### Crear variante (requiere token)
```http
POST /api/products/1/variantes
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "talla_id": 6,
  "precio_clp": 45000,
  "stock": 10
}
```

#### Actualizar variante (requiere token)
```http
PUT /api/products/1/variantes/1
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "precio_clp": 50000,
  "stock": 15
}
```

#### Eliminar variante (requiere token)
```http
DELETE /api/products/1/variantes/1
Authorization: Bearer <TOKEN>
```

### Imágenes de Productos (`/api/products/{productId}/imagenes`)

#### Obtener imágenes de un producto
```http
GET /api/products/1/imagenes
```

#### Agregar imagen a producto (requiere token)
```http
POST /api/products/1/imagenes
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "url_imagen": "https://example.com/image.jpg"
}
```

#### Eliminar imagen (requiere token)
```http
DELETE /api/products/1/imagenes/{imagenId}
Authorization: Bearer <TOKEN>
```

### Carrito (`/api/cart`)

#### Ver carrito (requiere token)
```http
GET /api/cart
Authorization: Bearer <TOKEN>
```

#### Agregar item al carrito (requiere token)
```http
POST /api/cart/add
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "tipo_item": "producto",
  "variante_producto_id": 1,
  "cantidad": 2
}
```

#### Remover item del carrito (requiere token)
```http
DELETE /api/cart/{itemId}
Authorization: Bearer <TOKEN>
```

#### Vaciar carrito (requiere token)
```http
DELETE /api/cart
Authorization: Bearer <TOKEN>
```

### Órdenes (`/api/orders`)

#### Crear orden/Checkout (requiere token)
```http
POST /api/orders
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "region_envio": "Región Metropolitana",
  "comuna_envio": "Santiago"
}
```

#### Listar mis órdenes (requiere token)
```http
GET /api/orders
Authorization: Bearer <TOKEN>
```

#### Obtener detalle de orden (requiere token)
```http
GET /api/orders/{orderId}
Authorization: Bearer <TOKEN>
```

#### Actualizar estado de orden (requiere token)
```http
PUT /api/orders/{orderId}/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "estado": "confirmada"
}
```

Estados válidos: `pendiente`, `confirmada`, `enviada`, `entregada`, `cancelada`

### Favoritos (`/api/favorites`)

#### Listar mis favoritos (requiere token)
```http
GET /api/favorites
Authorization: Bearer <TOKEN>
```

#### Agregar a favoritos (requiere token)
```http
POST /api/favorites
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "tipo_item": "producto",
  "producto_id": 1
}
```

#### Remover de favoritos (requiere token)
```http
DELETE /api/favorites/{favoritoId}
Authorization: Bearer <TOKEN>
```

### Publicaciones de Usuario (C2C) (`/api/publications`)

#### Listar publicaciones (con filtros)
```http
GET /api/publications
GET /api/publications?search=jordan
GET /api/publications?marca_id=1
GET /api/publications?talla_id=6
GET /api/publications?precio_min=100000&precio_max=200000
```

#### Obtener publicación por ID
```http
GET /api/publications/{id}
```

#### Crear publicación (requiere token)
```http
POST /api/publications
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "titulo": "Air Jordan 1 Retro",
  "modelo": "Chicago",
  "condicion": "buen estado",
  "precio_clp": 120000,
  "descripcion": "Sneakers vintage, poco uso",
  "region": "Región Metropolitana",
  "comuna": "Santiago",
  "marca_id": 1,
  "talla_id": 6,
  "tipo_entrega": "envío"
}
```

#### Mis publicaciones (requiere token)
```http
GET /api/publications/usuario/mis-publicaciones
Authorization: Bearer <TOKEN>
```

#### Actualizar publicación (requiere token)
```http
PUT /api/publications/{id}
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "precio_clp": 130000,
  "descripcion": "Precio ajustado"
}
```

#### Eliminar publicación (requiere token)
```http
DELETE /api/publications/{id}
Authorization: Bearer <TOKEN>
```

### Imágenes de Publicaciones (`/api/publications/{publicacionId}/imagenes`)

#### Obtener imágenes de una publicación
```http
GET /api/publications/1/imagenes
```

#### Agregar imagen a publicación (requiere token)
```http
POST /api/publications/1/imagenes
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "url_imagen": "https://example.com/publication-image.jpg"
}
```

#### Eliminar imagen de publicación (requiere token)
```http
DELETE /api/publications/imagenes/{imagenId}
Authorization: Bearer <TOKEN>
```

## Uso

1. Registra un usuario en `POST /api/auth/register`
2. Copia el token de la respuesta
3. En las siguientes peticiones, añade a Headers:
   - Key: `Authorization`
   - Value: `Bearer <TOKEN>`

## Seguridad

- **JWT**: Tokens válidos por 7 días
- **Bcrypt**: Contraseñas hasheadas con 10 rounds
- **CORS**: Configurado para aceptar requests del frontend
- **Validación**: Campos requeridos en controladores

## Notas

- Las contraseñas se guardan hasheadas en PostgreSQL
- Los IDs se generan con `Date.now()`
- El token JWT expira en 7 días
- Las marcas y tallas pre-cargadas en `schema.sql`
