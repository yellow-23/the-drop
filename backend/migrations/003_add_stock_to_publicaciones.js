const pool = require("../src/db");

async function runMigration() {
  try {
    console.log("[Migration] Agregando columna stock a publicaciones_usuario...");
    
    const columnExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'publicaciones_usuario' AND column_name = 'stock'
      )
    `);

    if (!columnExists.rows[0].exists) {
      await pool.query(`
        ALTER TABLE publicaciones_usuario 
        ADD COLUMN stock INTEGER DEFAULT 1 NOT NULL;
      `);
      
      console.log("[Migration] ✓ Columna stock agregada a publicaciones_usuario");
    } else {
      console.log("[Migration] ✓ Columna stock ya existe");
    }
  } catch (error) {
    console.error("[Migration] ✗ Error durante migración:", error.message);
    throw error;
  }
}

module.exports = { runMigration };
