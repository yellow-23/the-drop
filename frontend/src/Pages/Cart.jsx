import { useContext } from "react";
import { CartContext } from "../Context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <h1>Carrito</h1>
        <p>Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Carrito</h1>

      {cartItems.map((item) => (
        <div key={item.id}>
          <p>{item.name || item.nombre}</p>
          <p>${item.price || item.precio}</p>
          <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
        </div>
      ))}
      <button onClick={clearCart}>Vaciar Carrito</button>
    </div>
    )
}
export default Cart;