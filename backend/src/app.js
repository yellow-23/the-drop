const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const productsRoutes = require("./routes/products_routes");
const authRoutes = require("./routes/auth_routes");

const app = express();

app.use(cors());
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

module.exports = app;
