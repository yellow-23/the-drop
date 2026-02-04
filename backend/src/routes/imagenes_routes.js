const express = require("express");
const router = express.Router({ mergeParams: true });
const imagenesController = require("../controllers/imagenesController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Upload de imagen
router.post("/upload", verifyToken, upload.single('image'), imagenesController.uploadImage);

// Eliminar imagen subida
router.delete("/upload/:filename", verifyToken, imagenesController.deleteUploadedImage);

// Legacy routes
router.get("/", imagenesController.getImagenes);
router.post("/", verifyToken, imagenesController.createImagen);
router.delete("/:imagenId", verifyToken, imagenesController.deleteImagen);

module.exports = router;
