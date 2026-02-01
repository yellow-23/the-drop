import './CartItem.css';

function CartItem({ item, onRemove }) {
  const quantity = item.cantidad || 1;
  const price = Number(item.precio) || 0;
  const itemTotal = price * quantity;

  const imageUrl =
    item.imagen ||
    item.imagenes?.[0] ||
    "/images/placeholder-shoe.png";

  return (
    <div className="cart-item">
      <div className="item-product">
        <img
          src={imageUrl}
          alt={item.titulo}
          className="item-image"
        />

        <div className="item-info">
          <h3 className="item-name">{item.titulo}</h3>
          <p className="item-meta">
            {item.marca || "—"} • Talla {item.talla || "—"}
          </p>
        </div>
      </div>

      <div className="item-price">
        ${price.toLocaleString("es-CL")}
      </div>

      <div className="item-quantity">
        <span className="qty-badge">{quantity}</span>
      </div>

      <div className="item-total">
        ${itemTotal.toLocaleString("es-CL")}
      </div>

      <div className="item-actions">
        <button
          onClick={onRemove}
          className="btn-remove"
          title="Eliminar del carrito"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default CartItem;
