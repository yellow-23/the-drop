import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../Context/FavoritesContext";
import "./ProductCard.css";
import { useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import { useAuth } from "../../Context/AuthContext";
import { useLoginModal } from "../../Context/LoginModalContext";
import { useNotification } from "../../Context/NotificationContext";

function ProductCard({
  id,
  titulo,
  precio_clp,
  condicion,
  genero,
  marca,
  talla,
  imagen,
  stock,
  showDelete = false,
  showEdit = false,
  onDelete,
  onEdit,
}) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(id);
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { showSuccess, showError } = useNotification();
  const hasStockInfo = typeof stock === "number"; 
  const isOutOfStock = hasStockInfo && stock <= 0;


  const handleAddToCart = () => {
    if (!user) {
      openLoginModal("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    if (isOutOfStock) {
      showError("Este producto está agotado");
      return;
    }

    try {
      addToCart("publicacion", null, id, 1);
      showSuccess("Producto agregado al carrito");
    } catch (error) {
      showError(error.message || "Error al agregar al carrito");
    }
  };

  return (
    <div className="product-card">

      <div className="product-card-actions">
      {!showDelete && !showEdit && (
        <button
        className={`favorite-btn ${favorite ? "active" : ""}`}
        onClick={() =>
          toggleFavorite({ id, imagen, titulo, talla, genero, marca, precio_clp, condicion })
        }
      >
        ♥
      </button>
      )}
      
        {showDelete && (
          <button
            className="favorite-btn delete-btn"
            onClick={() => onDelete(id)}
          >
            X
          </button>
        )}

        {showEdit && (
          <button
            className="favorite-btn edit-btn"
            onClick={() => onEdit(id)}
            title="Editar"
          >
            ✎
          </button>
        )}

        {showEdit && (
          <button
            className="favorite-btn edit-btn"
            onClick={() => onEdit(id)}
            title="Editar producto"
          >
            ✎
          </button>
        )}

      </div>

      <div className="product-image">
        <img
          src={imagen || "/images/placeholder-shoe.png"}
          alt={titulo}
        />
        {isOutOfStock && (
          <div className="out-of-stock-overlay">
            <span className="sold-badge">AGOTADO</span>
          </div>
        )}
        {!isOutOfStock && stock && (
          <div className="stock-badge">
            {stock === 1 ? "1 disponible" : stock <= 3 ? `${stock} disponibles` : "3+ disponibles"}
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{titulo}</h3>

        <p className="product-meta">
          Talla | {talla}
        </p>

        <p className="product-meta">
          {genero}
        </p>

        <p className="product-meta">
          {marca}
        </p>

        <p className="product-price">${Number(precio_clp).toLocaleString('es-CL')}</p>
      </div>

      <div className="product-actions">
        <button
          className="product-btn product-btn-carrito"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          title={isOutOfStock ? "Producto agotado" : "Agregar al carrito"}
        >
          {isOutOfStock ? "AGOTADO" : "AGREGAR AL CARRITO"}
        </button>

        <button
          className="product-btn product-btn-detalle"
          onClick={() => navigate(`/product/${id}`)}
        >
          DETALLE
        </button>
      </div>
    </div>
  );
}export default ProductCard;
