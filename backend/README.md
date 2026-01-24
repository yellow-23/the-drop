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

### Productos (`/api/products`)

#### Listar productos
```http
GET /api/products
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
