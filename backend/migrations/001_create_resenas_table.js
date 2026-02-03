const pool = require("../src/db");

const migrationSQL = `
CREATE TABLE IF NOT EXISTS resenas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    producto_id BIGINT REFERENCES productos(id),
    publicacion_id BIGINT REFERENCES publicaciones_usuario(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL,
    CONSTRAINT check_item_type CHECK (
        (producto_id IS NOT NULL AND publicacion_id IS NULL) OR
        (producto_id IS NULL AND publicacion_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_resenas_producto_id ON resenas(producto_id);
CREATE INDEX IF NOT EXISTS idx_resenas_publicacion_id ON resenas(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_resenas_usuario_id ON resenas(usuario_id);
`;

async function runMigration() {
  try {
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'resenas'
      )
    `);

    if (!tableExists.rows[0].exists) {
      await pool.query(migrationSQL);
      console.log("[Migration] ✓ Tabla resenas creada exitosamente");
    } else {
      console.log("[Migration] ✓ Tabla resenas ya existe");
    }
  } catch (error) {
    console.error("[Migration] ✗ Error durante migración:", error.message);
    throw error;
  }
}

module.exports = { runMigration };
