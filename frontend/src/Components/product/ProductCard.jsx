import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../Context/FavoritesContext";
import "./ProductCard.css";
import { useContext } from "react";
import { CartContext } from "../../Context/CartContext";

function ProductCard({
  id,
  titulo,
  precio_clp,
  condicion,
  genero,
  marca,
  talla,
  imagen,
  showDelete = false,
  onDelete,
}) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(id);
  const { addToCart } = useContext(CartContext);


  return (
    <div className="product-card">

      <div className="product-card-actions">
      {!showDelete && (
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
            className="favorite-btn"
            onClick={() => onDelete(id)}
          >
            X
          </button>
        )}

      </div>

      <div className="product-image">
        <img
          src={imagen || "/images/placeholder-shoe.png"}
          alt={titulo}
        />
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

        <p className="product-price">${precio_clp}</p>
      </div>

      <div className="product-actions">
        <button
          className="product-btn product-btn-carrito"
          onClick={() =>
            addToCart("publicacion", null, id, 1)
          }
        >
          AGREGAR AL CARRITO
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
}

export default ProductCard;
