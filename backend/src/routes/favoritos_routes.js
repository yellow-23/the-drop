const express = require("express");
const router = express.Router();
const favoritosController = require("../controllers/favoritosController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, favoritosController.getFavoritos);
router.post("/", verifyToken, favoritosController.addFavorito);
router.delete("/:favoritoId", verifyToken, favoritosController.removeFavorito);

module.exports = router;
