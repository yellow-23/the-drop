const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, cartController.getCart);
router.post("/add", verifyToken, cartController.addToCart);
router.delete("/:itemId", verifyToken, cartController.removeFromCart);
router.delete("/", verifyToken, cartController.clearCart);

module.exports = router;
