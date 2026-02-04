const pool = require("../src/db");

async function runMigration() {
  try {
    console.log("[Migration] Modificando tabla resenas para reseñas de vendedores...");
    
    const columnExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'resenas' AND column_name = 'vendedor_id'
      )
    `);

    if (!columnExists.rows[0].exists) {
      await pool.query(`
        ALTER TABLE resenas 
        ADD COLUMN vendedor_id BIGINT REFERENCES usuarios(id);
      `);
      
      await pool.query(`
        UPDATE resenas 
        SET vendedor_id = (
          SELECT usuario_id 
          FROM publicaciones_usuario 
          WHERE id = resenas.publicacion_id
        )
        WHERE publicacion_id IS NOT NULL;
      `);
      
      await pool.query(`
        ALTER TABLE resenas 
        DROP CONSTRAINT IF EXISTS check_item_type;
      `);
      
      await pool.query(`
        ALTER TABLE resenas 
        ADD CONSTRAINT check_vendedor_required 
        CHECK (vendedor_id IS NOT NULL);
      `);
      
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_resenas_vendedor_id ON resenas(vendedor_id);
      `);
      
      console.log("[Migration] ✓ Tabla resenas actualizada para reseñas de vendedores");
    } else {
      console.log("[Migration] ✓ Tabla resenas ya tiene columna vendedor_id");
    }
  } catch (error) {
    console.error("[Migration] ✗ Error durante migración:", error.message);
    throw error;
  }
}

module.exports = { runMigration };
