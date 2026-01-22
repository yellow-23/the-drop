const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Lista de productos" });
});

router.post("/", (req, res) => {
  res.json({ message: "Producto creado", data: req.body });
});

module.exports = router;