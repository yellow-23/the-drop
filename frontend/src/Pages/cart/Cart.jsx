import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import CartItem from "../../Components/product/CartItem";
import CartSummary from "../../Components/product/CartSummary";
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <div className="empty-content">
          <h1>Tu carrito está vacío</h1>
          <p>Parece que aún no has agregado ninguna zapatilla</p>
          <Link to="/catalog" className="btn-volver">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Carrito de Compras</h1>
        <p className="item-count">{cartItems.length} artículos</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          <div className="items-header">
            <span className="col-producto">Producto</span>
            <span className="col-precio">Precio</span>
            <span className="col-cantidad">Cantidad</span>
            <span className="col-total">Total</span>
            <span className="col-acciones">Acciones</span>
          </div>

          {cartItems.map((item) => (
            <CartItem 
              key={item.id} 
              item={item}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
        </div>

        <CartSummary 
          total={total}
          itemCount={cartItems.length}
          onClear={clearCart}
        />
      </div>

      <div className="cart-actions">
        <Link to="/catalog" className="btn-continuar">
          Continuar Comprando
        </Link>
        <button onClick={clearCart} className="btn-vaciar">
          Vaciar Carrito
        </button>
      </div>
    </div>
  );
}

export default Cart;
