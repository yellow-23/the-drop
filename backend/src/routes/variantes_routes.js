const express = require("express");
const router = express.Router({ mergeParams: true });
const variantesController = require("../controllers/variantesController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", variantesController.getVariantes);
router.post("/", verifyToken, variantesController.createVariante);
router.put("/:varianteId", verifyToken, variantesController.updateVariante);
router.delete("/:varianteId", verifyToken, variantesController.deleteVariante);

module.exports = router;
