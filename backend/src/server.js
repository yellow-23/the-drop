require("dotenv").config();
const app = require("./app");
const { runMigration } = require("./migrations/001_create_resenas_table");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await runMigration();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
