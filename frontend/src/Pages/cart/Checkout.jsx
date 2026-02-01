import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart();

    const timer = setTimeout(() => {
      navigate("/catalog");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h1>✅ Pago realizado con éxito</h1>
        <p>Gracias por tu compra</p>
        <p>Serás redirigido al catálogo</p>
      </div>
    </div>
  );
}

export default Checkout;
