import './CartItem.css';

function CartItem({ item, onRemove }) {
  const quantity = item.quantity || 1;
  const itemTotal = item.price * quantity;

  return (
    <div className="cart-item">
      <div className="item-product">
        <img src={item.image} alt={item.name} className="item-image" />
        <div className="item-info">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-meta">{item.brand} • Talla {item.size}</p>
        </div>
      </div>

      <div className="item-price">
        ${item.price.toLocaleString('es-CL')}
      </div>

      <div className="item-quantity">
        <span className="qty-badge">{quantity}</span>
      </div>

      <div className="item-total">
        ${itemTotal.toLocaleString('es-CL')}
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
