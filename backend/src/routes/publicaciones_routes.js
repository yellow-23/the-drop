const express = require("express");
const router = express.Router();
const publicacionesController = require("../controllers/publicacionesController");
const publicacionesImagenesController = require("../controllers/publicacionesImagenesController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", publicacionesController.getPublicaciones);
router.get("/usuario/mis-publicaciones", verifyToken, publicacionesController.getPublicacionesUsuario);
router.get("/:id", publicacionesController.getPublicacionById);
router.post("/", verifyToken, publicacionesController.createPublicacion);
router.put("/:id", verifyToken, publicacionesController.updatePublicacion);
router.delete("/:id", verifyToken, publicacionesController.deletePublicacion);
router.get("/:publicacionId/imagenes", publicacionesImagenesController.getImagenesPublicacion);
router.post("/:publicacionId/imagenes", verifyToken, publicacionesImagenesController.createImagenPublicacion);
router.delete("/imagenes/:imagenId", verifyToken, publicacionesImagenesController.deleteImagenPublicacion);

module.exports = router;
