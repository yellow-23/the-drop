const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, orderController.createOrder);
router.get("/", verifyToken, orderController.getUserOrders);
router.get("/:orderId", verifyToken, orderController.getOrderDetail);
router.put("/:orderId/status", verifyToken, orderController.updateOrderStatus);

module.exports = router;
