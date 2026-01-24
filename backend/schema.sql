CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(120),
    email VARCHAR(255),
    password_hash TEXT,
    region VARCHAR(80),
    comuna VARCHAR(80),
    reputacion DECIMAL(2,1),
    avatar TEXT,
    creado_en TIMESTAMPTZ
);

CREATE TABLE marcas (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(80)
);

CREATE TABLE tallas_cl (
    id BIGINT PRIMARY KEY,
    talla_cl NUMERIC(4,1)
);

CREATE TABLE productos (
    id BIGINT PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    marca_id BIGINT REFERENCES marcas(id),
    titulo VARCHAR(160),
    modelo VARCHAR(120),
    descripcion TEXT,
    creado_en TIMESTAMPTZ
);

CREATE TABLE variantes_producto (
    id BIGINT PRIMARY KEY,
    producto_id BIGINT REFERENCES productos(id),
    talla_id BIGINT REFERENCES tallas_cl(id),
    precio_clp INTEGER,
    stock INTEGER
);

CREATE TABLE imagenes_producto (
    id BIGINT PRIMARY KEY,
    producto_id BIGINT REFERENCES productos(id),
    url_imagen TEXT
);

CREATE TABLE publicaciones_usuario (
    id BIGINT PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    marca_id BIGINT REFERENCES marcas(id),
    talla_id BIGINT REFERENCES tallas_cl(id),
    titulo VARCHAR(160),
    modelo VARCHAR(120),
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
    id BIGINT PRIMARY KEY,
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    url_imagen TEXT
);

CREATE TABLE favoritos (
    id BIGINT PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    tipo_item VARCHAR(30),
    producto_id BIGINT REFERENCES productos(id),
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    creado_en TIMESTAMPTZ
);

CREATE TABLE carritos (
    id BIGINT PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    creado_en TIMESTAMPTZ
);

CREATE TABLE items_carrito (
    id BIGINT PRIMARY KEY,
    carrito_id BIGINT REFERENCES carritos(id),
    tipo_item VARCHAR(30),
    variante_producto_id BIGINT REFERENCES variantes_producto(id),
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    cantidad INTEGER,
    creado_en TIMESTAMPTZ
);

CREATE TABLE ordenes (
    id BIGINT PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    total_clp INTEGER,
    estado VARCHAR(20),
    region_envio VARCHAR(80),
    comuna_envio VARCHAR(80),
    creado_en TIMESTAMPTZ
);

CREATE TABLE items_orden (
    id BIGINT PRIMARY KEY,
    orden_id BIGINT REFERENCES ordenes(id),
    tipo_item VARCHAR(30),
    variante_producto_id BIGINT REFERENCES variantes_producto(id),
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    cantidad INTEGER,
    precio_snapshot_clp INTEGER
);
