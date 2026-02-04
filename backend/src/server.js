require("dotenv").config();
const app = require("./app");
const { runMigration: createResenasTable } = require("../migrations/001_create_resenas_table");
const { runMigration: updateResenasVendedor } = require("../migrations/002_resenas_vendedor");
const { runMigration: addStockToPublicaciones } = require("../migrations/003_add_stock_to_publicaciones");
const { runMigration: addAvatarToUsuarios } = require("../migrations/004_add_avatar_to_usuarios");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await createResenasTable();
    await updateResenasVendedor();
    await addStockToPublicaciones();
    await addAvatarToUsuarios();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
