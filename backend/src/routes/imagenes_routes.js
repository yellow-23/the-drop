const express = require("express");
const router = express.Router({ mergeParams: true });
const imagenesController = require("../controllers/imagenesController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", imagenesController.getImagenes);
router.post("/", verifyToken, imagenesController.createImagen);
router.delete("/:imagenId", verifyToken, imagenesController.deleteImagen);

module.exports = router;
