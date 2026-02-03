const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/productos/:productId", reviewsController.getProductReviews);
router.get("/productos/:productId/rating", reviewsController.getProductRating);
router.post("/productos/:productId", verifyToken, reviewsController.createProductReview);

router.get("/publicaciones/:publicacionId", reviewsController.getPublicacionReviews);
router.get("/publicaciones/:publicacionId/rating", reviewsController.getPublicacionRating);
router.post("/publicaciones/:publicacionId", verifyToken, reviewsController.createPublicacionReview);

router.delete("/:reviewId", verifyToken, reviewsController.deleteReview);

module.exports = router;
