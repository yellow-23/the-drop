import { useNavigate } from "react-router-dom";
import { useFavorites } from "../Context/FavoritesContext";
import "./ProductCard.css";
import { useContext } from "react";
import { CartContext } from "../Context/CartContext";

function ProductCard({
  id,
  image,
  name,
  size,
  gender,
  brand,
  price,
  condition,
}) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <button
        className={`favorite-btn ${favorite ? "active" : ""}`}
        onClick={() =>
          toggleFavorite({ id, image, name, size, gender, brand, price, condition })
        }
      >
        ♥
      </button>

      <div className="product-image">
        <img
          src={image || "/images/placeholder-shoe.png"}
          alt={name}
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <p className="product-meta">
          Talla | {size}
        </p>

        <p className="product-meta">
          {gender}
        </p>

        <p className="product-meta">
          {brand}
        </p>

        <p className="product-price">${price}</p>
      </div>

      <button
        className="product-btn"
        onClick={() =>
          addToCart({
            id,
            image,
            name,
            size,
            gender,
            brand,
            price,
          })
        }
      >
        AGREGAR AL CARRITO
      </button>

      <button
        className="product-btn"
        onClick={() => navigate(`/product/${id}`)}
      >
        DETALLE DEL PRODUCTO
      </button>
    </div>
  );
}

export default ProductCard;
