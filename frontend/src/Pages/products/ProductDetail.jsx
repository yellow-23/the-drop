import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import publicacionesService from "../../services/publicacionesService";
import reviewsService from "../../services/reviewsService";
import { CartContext } from "../../Context/CartContext";
import { useFavorites } from "../../Context/FavoritesContext";
import { useNotification } from "../../Context/NotificationContext";
import ProductReviews from "../../Components/product/ProductReviews";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showSuccess, showError } = useNotification();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState({ promedio: 0, total_resenas: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await publicacionesService.getPublicacionById(id);
        setProduct(data.publicacion);
        
        // Obtener rating de reseñas
        const ratingData = await reviewsService.getPublicacionRating(id);
        setRating(ratingData);
      } catch (error) {
        console.error("Error al obtener publicación:", error);
        showError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="not-found">
          <h1>Producto no encontrado</h1>
          <button onClick={() => navigate("/catalog")} className="btn-volver">
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  const isFav = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart("publicacion", null, product.id, 1);
    showSuccess("Producto agregado al carrito");
  };

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: product.id,
      titulo: product.titulo,
      precio_clp: product.precio_clp,
      marca: product.marca,
    });
  };

  return (
    <div className="product-detail-container">
      <div className="detail-header-top">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver al Catálogo
        </button>
      </div>

      <div className="product-detail">
        {/* IMAGEN */}
        <div className="detail-image-section">
          <div className="detail-image-container">
            <img
              src={product.imagenes?.[0] || "/images/placeholder-shoe.png"}
              alt={product.titulo}
              className="detail-image"
            />

            <button
              className={`favorite-btn-detail ${isFav ? "active" : ""}`}
              onClick={handleToggleFavorite}
            >
              ♥
            </button>
          </div>
        </div>

        {/* INFO */}
        <div className="detail-info-section">
          <div className="detail-header">
            <h1 className="product-title">{product.titulo}</h1>
            <p className="product-brand">{product.marca}</p>
          </div>

          <div className="product-rating">
            <span className="stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.round(rating.promedio) ? "filled" : ""}>
                  ★
                </span>
              ))}
            </span>
            <span className="review-count">({rating.total_resenas} {rating.total_resenas === 1 ? 'reseña' : 'reseñas'})</span>
          </div>

          <div className="product-price-detail">
            <span className="price">
              ${product.precio_clp.toLocaleString("es-CL")}
            </span>
            <span className="sustainability">Sostenible</span>
          </div>

          <div className="product-specs">
            <div className="spec-item">
              <span className="spec-label">Talla</span>
              <span className="spec-value">{product.talla || "—"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Género</span>
              <span className="spec-value">{product.genero}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Disponibilidad</span>
              <span className="spec-value in-stock">En Stock</span>
            </div>
          </div>

          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.descripcion || "El vendedor no agregó descripción."}</p>
          </div>

          <div className="product-benefits">
            <h3>Beneficios</h3>
            <ul>
              <li>Materiales de calidad</li>
              <li>Producto revisado</li>
              <li>Compra segura</li>
              <li>Envíos a todo Chile</li>
            </ul>
          </div>

          <div className="detail-actions">
            <button onClick={handleAddToCart} className="btn-add-to-cart">
              Agregar al Carrito
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="btn-view-cart"
            >
              Ver Carrito
            </button>
          </div>

          <div className="shipping-info">
            <p>Envío a todo Chile</p>
            <p>Cambios y devoluciones en 14 días</p>
            <p>Compra 100% segura</p>
          </div>
        </div>
      </div>

      <ProductReviews publicacionId={product.id} />
    </div>
  );
}

export default ProductDetail;