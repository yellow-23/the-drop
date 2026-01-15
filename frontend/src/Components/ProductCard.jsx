import "./ProductCard.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({
  image,
  name,
  size,
  gender,
  brand,
  price,
}) {

  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
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

        <button className="product-btn"
        onClick={() =>
          addToCart({
            id: name + size + brand,
            image,
            name,
            size,
            gender,
            brand,
            price,
          })
        }>
          AGREGAR AL CARRITO
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
