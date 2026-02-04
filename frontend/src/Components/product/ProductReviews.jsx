import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNotification } from "../../Context/NotificationContext";
import reviewsService from "../../services/reviewsService";
import "./ProductReviews.css";

function ProductReviews({ vendedorId, publicacionId = null, vendedorNombre = "este vendedor" }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showForm, setShowForm] = useState(false);
  const [showOwnPublicationModal, setShowOwnPublicationModal] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        let data;
        if (vendedorId) {
          data = await reviewsService.getVendedorReviews(vendedorId);
        } else if (publicacionId) {
          data = await reviewsService.getPublicacionReviews(publicacionId);
        }
        setReviews(data || []);
      } catch (error) {
        console.error("Error cargando reseñas:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (vendedorId || publicacionId) {
      fetchReviews();
    }
  }, [vendedorId, publicacionId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      showError("Debes iniciar sesión para dejar una reseña");
      return;
    }

    if (!newReview.comment.trim()) {
      showError("Escribe un comentario");
      return;
    }

    if (!publicacionId) {
      showError("Debes comprar algo del vendedor para reseñar");
      return;
    }

    try {
      setSubmitting(true);
      const createdReview = await reviewsService.createPublicacionReview(publicacionId, {
        rating: newReview.rating,
        comment: newReview.comment,
      });

      setReviews([createdReview, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
      setShowForm(false);
      showSuccess("Reseña enviada exitosamente");
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      
      const errorMessage = error?.message || "Error al enviar la reseña";
      
      // Mostrar modal si es su propia publicación
      if (errorMessage.includes("propia publicación")) {
        setShowOwnPublicationModal(true);
      } else {
        showError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      return;
    }

    try {
      await reviewsService.deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
      showSuccess("Reseña eliminada");
    } catch (error) {
      console.error("Error al eliminar reseña:", error);
      showError("Error al eliminar la reseña");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="reviews-section"><p>Cargando reseñas...</p></div>;
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Reseñas del vendedor ({reviews.length})</h3>
        {reviews.length > 0 && (
          <div className="rating-summary">
            <div className="average-rating">
              <strong>{averageRating}</strong>
              <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
            </div>
          </div>
        )}
      </div>

      {user ? (
        <button
          className="btn-write-review"
          onClick={() => setShowForm(!showForm)}
          disabled={submitting}
        >
          {showForm ? "Cerrar" : `Reseñar a ${vendedorNombre}`}
        </button>
      ) : (
        <p className="login-prompt">Inicia sesión para dejar una reseña del vendedor</p>
      )}

      {showForm && user && (
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

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar Reseña"}
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">Sin reseñas aún. ¡Sé el primero!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <strong className="reviewer-name">{review.usuario || "Usuario"}</strong>
                  <div className="review-rating">{renderStars(review.rating)}</div>
                </div>
                <div className="review-actions">
                  <span className="review-date">
                    {review.fecha ? new Date(review.fecha).toLocaleDateString() : "Hace poco"}
                  </span>
                  {user && user.id === review.usuario_id && (
                    <button
                      className="btn-delete-review"
                      onClick={() => handleDeleteReview(review.id)}
                      title="Eliminar reseña"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal: No puedes reseñar tu propia publicación */}
      {showOwnPublicationModal && (
        <div className="review-modal-overlay">
          <div className="review-modal-content">
            <button
              className="review-modal-close"
              onClick={() => setShowOwnPublicationModal(false)}
            >
              ✕
            </button>
            <div className="review-modal-header">
              <h2>⚠️ No puedes reseñar tu propia publicación</h2>
            </div>
            <div className="review-modal-body">
              <p>
                No es posible dejar una reseña en tus propias publicaciones. 
                Solo los compradores pueden dejar reseñas después de realizar una compra.
              </p>
              <p className="review-modal-hint">
                Esto nos ayuda a mantener la confianza en el marketplace.
              </p>
            </div>
            <div className="review-modal-actions">
              <button
                className="review-modal-button"
                onClick={() => setShowOwnPublicationModal(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
