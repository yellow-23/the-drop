const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre FROM marcas ORDER BY nombre"
    );

    res.json({
      ok: true,
      marcas: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener marcas",
    });
  }
});

module.exports = router;