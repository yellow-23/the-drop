const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const variantesRoutes = require("./variantes_routes");
const imagenesRoutes = require("./imagenes_routes");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", verifyToken, productController.createProduct);
router.put("/:id", verifyToken, productController.updateProduct);
router.delete("/:id", verifyToken, productController.deleteProduct);
router.use("/:productId/variantes", variantesRoutes);
router.use("/:productId/imagenes", imagenesRoutes);

module.exports = router;