const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const productsRoutes = require("./routes/products_routes");
const authRoutes = require("./routes/auth_routes");
const cartRoutes = require("./routes/cart_routes");
const orderRoutes = require("./routes/order_routes");
const favoritosRoutes = require("./routes/favoritos_routes");
const publicacionesRoutes = require("./routes/publicaciones_routes");
const marcasRoutes = require("./routes/brand_routes");    
const tallasRoutes = require("./routes/size_routes");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, message: "API funcionando", dbTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "API funcionando pero BD NO conectada",
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoritosRoutes);
app.use("/api/publications", publicacionesRoutes);
app.use("/api/brands", marcasRoutes);
app.use("/api/sizes", tallasRoutes);

module.exports = app;
