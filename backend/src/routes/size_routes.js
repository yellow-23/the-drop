const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, talla_cl FROM tallas_cl ORDER BY talla_cl"
    );

    res.json({
      ok: true,
      tallas: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener tallas:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener tallas",
    });
  }
});

module.exports = router;