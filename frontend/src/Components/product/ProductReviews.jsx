import { useState } from "react";
import "./ProductReviews.css";

function ProductReviews({ productId, reviews = [] }) {
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showForm, setShowForm] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      alert("Escribe un comentario");
      return;
    }
    console.log("Review enviada:", newReview);
    setNewReview({ rating: 5, comment: "" });
    setShowForm(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Reseñas ({reviews.length})</h3>
        {reviews.length > 0 && (
          <div className="rating-summary">
            <div className="average-rating">
              <strong>{averageRating}</strong>
              <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
            </div>
          </div>
        )}
      </div>

      <button
        className="btn-write-review"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cerrar" : "Escribir Reseña"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="form-group">
            <label>Calificación</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`star-btn ${newReview.rating >= rating ? "active" : ""}`}
                  onClick={() => setNewReview({ ...newReview, rating })}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Comentario</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Comparte tu experiencia con este producto..."
              rows="4"
            />
          </div>

          <button type="submit" className="btn-submit">
            Enviar Reseña
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">Sin reseñas aún. ¡Sé el primero!</p>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <strong className="reviewer-name">{review.usuario || "Usuario"}</strong>
                  <div className="review-rating">{renderStars(review.rating)}</div>
                </div>
                <span className="review-date">
                  {review.fecha ? new Date(review.fecha).toLocaleDateString() : "Hace poco"}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductReviews;
