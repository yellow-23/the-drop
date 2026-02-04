const pool = require("../src/db");

async function runMigration() {
  try {
    console.log("[Migration] Verificando columna avatar en usuarios...");
    
    const columnExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'avatar'
      )
    `);

    if (!columnExists.rows[0].exists) {
      console.log("[Migration] Agregando columna avatar...");
      await pool.query(`
        ALTER TABLE usuarios 
        ADD COLUMN avatar TEXT;
      `);
      console.log("[Migration] ✓ Columna avatar agregada");
    } else {
      console.log("[Migration] ✓ Columna avatar ya existe");
    }
  } catch (error) {
    console.error("[Migration] ✗ Error durante migración:", error.message);
    throw error;
  }
}

module.exports = { runMigration };
