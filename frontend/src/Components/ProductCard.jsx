import "./ProductCard.css";

function ProductCard({
  image,
  name,
  size,
  gender,
  brand,
  price,
}) {
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

        <button className="product-btn">
          DETALLE DEL PRODUCTO
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
