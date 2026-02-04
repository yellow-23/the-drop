const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/vendedores/:vendedorId", reviewsController.getVendedorReviews);
router.get("/vendedores/:vendedorId/rating", reviewsController.getVendedorRating);

router.get("/publicaciones/:publicacionId", reviewsController.getPublicacionReviews);
router.get("/publicaciones/:publicacionId/rating", reviewsController.getPublicacionRating);
router.post("/publicaciones/:publicacionId", verifyToken, reviewsController.createPublicacionReview);

router.delete("/:reviewId", verifyToken, reviewsController.deleteReview);

module.exports = router;
