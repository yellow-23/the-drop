-- Agregar columna vendedor_id a tabla resenas
-- Primero como nullable para no romper filas existentes
ALTER TABLE resenas 
ADD COLUMN IF NOT EXISTS vendedor_id BIGINT REFERENCES usuarios(id);

-- Llenar vendedor_id basado en publicacion_id
UPDATE resenas r
SET vendedor_id = p.usuario_id
FROM publicaciones_usuario p
WHERE r.publicacion_id = p.id AND r.vendedor_id IS NULL;

-- Agregar constraint si no existe
ALTER TABLE resenas
ADD CONSTRAINT check_vendedor_required 
CHECK (
  (producto_id IS NOT NULL AND publicacion_id IS NULL AND vendedor_id IS NULL) OR
  (producto_id IS NULL AND publicacion_id IS NOT NULL AND vendedor_id IS NOT NULL)
);
