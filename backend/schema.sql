-- Eliminar tablas si existen (en orden inverso de dependencias)
DROP TABLE IF EXISTS items_orden CASCADE;
DROP TABLE IF EXISTS ordenes CASCADE;
DROP TABLE IF EXISTS items_carrito CASCADE;
DROP TABLE IF EXISTS carritos CASCADE;
DROP TABLE IF EXISTS favoritos CASCADE;
DROP TABLE IF EXISTS imagenes_publicacion_usuario CASCADE;
DROP TABLE IF EXISTS publicaciones_usuario CASCADE;
DROP TABLE IF EXISTS imagenes_producto CASCADE;
DROP TABLE IF EXISTS variantes_producto CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS tallas_cl CASCADE;
DROP TABLE IF EXISTS marcas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(120),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    region VARCHAR(80),
    comuna VARCHAR(80),
    reputacion DECIMAL(2,1),
    avatar TEXT,
    creado_en TIMESTAMPTZ NOT NULL
);

CREATE TABLE marcas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(80)
);

CREATE TABLE tallas_cl (
    id BIGSERIAL PRIMARY KEY,
    talla_cl NUMERIC(4,1)
);

CREATE TABLE productos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    marca_id BIGINT REFERENCES marcas(id),
    titulo VARCHAR(160) NOT NULL,
    modelo VARCHAR(120) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMPTZ NOT NULL
);

CREATE TABLE variantes_producto (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    talla_id BIGINT NOT NULL REFERENCES tallas_cl(id),
    precio_clp INTEGER NOT NULL,
    stock INTEGER NOT NULL
);

CREATE TABLE imagenes_producto (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT REFERENCES productos(id),
    url_imagen TEXT
);

CREATE TABLE publicaciones_usuario (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    marca_id BIGINT REFERENCES marcas(id),
    talla_id BIGINT REFERENCES tallas_cl(id),
    titulo VARCHAR(160),
    modelo VARCHAR(120),
    genero VARCHAR(50),
    condicion VARCHAR(30),
    precio_clp INTEGER,
    descripcion TEXT,
    estado VARCHAR(20),
    region VARCHAR(80),
    comuna VARCHAR(80),
    co2_ahorrado_kg DECIMAL(5,2),
    veces_revendido INTEGER,
    tipo_entrega VARCHAR(50),
    creado_en TIMESTAMPTZ
);

CREATE TABLE imagenes_publicacion_usuario (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    url_imagen TEXT
);

CREATE TABLE favoritos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    tipo_item VARCHAR(30),
    producto_id BIGINT REFERENCES productos(id),
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    creado_en TIMESTAMPTZ
);

CREATE TABLE carritos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT UNIQUE NOT NULL REFERENCES usuarios(id),
    creado_en TIMESTAMPTZ NOT NULL
);

CREATE TABLE items_carrito (
    id BIGSERIAL PRIMARY KEY,
    carrito_id BIGINT NOT NULL REFERENCES carritos(id),
    tipo_item VARCHAR(30) NOT NULL,
    variante_producto_id BIGINT REFERENCES variantes_producto(id),
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    cantidad INTEGER NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL
);

CREATE TABLE ordenes (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    total_clp INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL,
    region_envio VARCHAR(80) NOT NULL,
    comuna_envio VARCHAR(80) NOT NULL,
    direccion VARCHAR(255),
    creado_en TIMESTAMPTZ NOT NULL
);

CREATE TABLE items_orden (
    id BIGSERIAL PRIMARY KEY,
    orden_id BIGINT NOT NULL REFERENCES ordenes(id),
    tipo_item VARCHAR(30) NOT NULL,
    variante_producto_id BIGINT REFERENCES variantes_producto(id),
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    cantidad INTEGER NOT NULL,
    precio_snapshot_clp INTEGER NOT NULL
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_productos_usuario_id ON productos(usuario_id);
CREATE INDEX idx_productos_marca_id ON productos(marca_id);
CREATE INDEX idx_productos_titulo ON productos(titulo);
CREATE INDEX idx_variantes_producto_id ON variantes_producto(producto_id);
CREATE INDEX idx_ordenes_usuario_id ON ordenes(usuario_id);
CREATE INDEX idx_items_orden_orden_id ON items_orden(orden_id);
CREATE INDEX idx_items_carrito_carrito_id ON items_carrito(carrito_id);
CREATE INDEX idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX idx_publicaciones_usuario_id ON publicaciones_usuario(usuario_id);
CREATE INDEX idx_publicaciones_titulo ON publicaciones_usuario(titulo);

INSERT INTO marcas (nombre) VALUES 
('Nike'),
('Adidas'),
('Puma'),
('New Balance'),
('Converse');

INSERT INTO tallas_cl (talla_cl) VALUES 
(35.0),
(36.0),
(37.0),
(38.0),
(39.0),
(40.0),
(41.0),
(42.0),
(43.0),
(44.0);

INSERT INTO usuarios (nombre, email, password_hash, region, comuna, reputacion, creado_en) VALUES 
('Juan Test', 'juan@test.com', '$2a$10$test', 'Región Metropolitana', 'Santiago', 5.0, NOW());

INSERT INTO productos (usuario_id, marca_id, titulo, modelo, descripcion, creado_en) VALUES 
(1, 1, 'Nike Air Force 1', 'AF1 Classic', 'Zapatillas clásicas de Nike', NOW());

INSERT INTO imagenes_producto (producto_id, url_imagen) VALUES 
(1, '');

INSERT INTO variantes_producto (producto_id, talla_id, precio_clp, stock) VALUES 
(1, 6, 45000, 10),
(1, 7, 45000, 8),
(1, 8, 45000, 5);

INSERT INTO publicaciones_usuario (usuario_id, marca_id, talla_id, titulo, modelo, genero, condicion, precio_clp, descripcion, estado, region, comuna, co2_ahorrado_kg, veces_revendido, tipo_entrega, creado_en) VALUES 
(1, 2, 5, 'Adidas Stan Smith', 'Stan Smith White', 'Unisex', 'Como nueva', 35000, 'Zapatillas Adidas Stan Smith en perfecto estado, solo usadas 2 veces', 'activa', 'Región Metropolitana', 'Santiago', 2.5, 0, 'Presencial y envío', NOW());

INSERT INTO imagenes_publicacion_usuario (publicacion_id, url_imagen) VALUES 
(1, 'https://assets.adidas.com/images/w_600,f_auto,q_auto/270b920981c14ac0a8b4ac72011dd318_9366/Zapatillas_Stan_Smith_Blanco_FX7524_01_00_standard.jpg');
