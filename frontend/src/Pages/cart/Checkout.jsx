import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { useAuth } from "../../Context/AuthContext";
import { useNotification } from "../../Context/NotificationContext";
import orderService from "../../services/orderService";
import CartSummary from "../../Components/product/CartSummary";
import Footer from "../../Components/layout/Footer";
import "./Checkout.css";

const REGIONES_CHILE = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena",
];

function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useContext(CartContext);
  const { user, loading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [formData, setFormData] = useState({
    region_envio: user?.region || "",
    comuna_envio: user?.comuna || "",
    direccion: user?.direccion || "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && !showSuccessOverlay && (!items || items.length === 0)) {
      navigate("/cart");
    }
  }, [items, loading, navigate, showSuccessOverlay]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>;
  }

  if (!user || ((!items || items.length === 0) && !showSuccessOverlay)) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.region_envio || !formData.comuna_envio || !formData.direccion) {
      showError("Región, Comuna y Dirección son requeridas");
      return;
    }

    setShowConfirm(true);
  };

  const confirmPurchase = async () => {
    setProcessing(true);

    try {
      const orderData = {
        region_envio: formData.region_envio,
        comuna_envio: formData.comuna_envio,
        direccion: formData.direccion,
      };

      await orderService.createOrder(orderData);
      await clearCart();

      showSuccess("Orden creada exitosamente");
      setShowConfirm(false);
      setShowSuccessOverlay(true);
      setTimeout(() => {
        navigate("/orders");
      }, 3500);
    } catch (error) {
      console.error("Error creando orden:", error);
      showError(error.message || "Error al procesar la compra");
      setProcessing(false);
      setShowConfirm(false);
    }
  };

  return (
    <main>
      <div className="checkout-container">
        <div className="checkout-wrapper">
          <div className="checkout-form-section">
            <h1>Confirmar Compra</h1>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>Dirección de Envío</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="region_envio">Región *</label>
                    <select
                      id="region_envio"
                      name="region_envio"
                      value={formData.region_envio}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una región</option>
                      {REGIONES_CHILE.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comuna_envio">Comuna *</label>
                    <input
                      type="text"
                      id="comuna_envio"
                      name="comuna_envio"
                      value={formData.comuna_envio}
                      onChange={handleChange}
                      placeholder="Ej: Santiago"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="direccion">Dirección *</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, apartamento"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-pagar"
                  disabled={processing}
                >
                  {processing ? "Procesando..." : "Completar Compra"}
                </button>
                <button 
                  type="button"
                  className="btn-volver"
                  onClick={() => navigate("/cart")}
                  disabled={processing}
                >
                  Volver al Carrito
                </button>
              </div>
            </form>
          </div>

          <div className="checkout-summary-section">
            <CartSummary 
              total={total} 
              itemCount={items.length}
              onClear={() => {}}
              showCheckoutButton={false}
            />
            
            <div className="order-items-summary">
              <h3>Resumen del Pedido</h3>
              <div className="items-list">
                {items.map((item) => (
                  <div key={item.id} className="summary-item-row">
                    <span className="item-title">{item.titulo}</span>
                    <span className="item-qty">x{item.cantidad}</span>
                    <span className="item-price">${(item.precio_clp || item.precio).toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="checkout-modal-backdrop" role="dialog" aria-modal="true">
          <div className="checkout-modal">
            <h3>¿Confirmas tu compra?</h3>
            <p>Revisa tus datos antes de finalizar la orden.</p>
            <div className="checkout-modal-actions">
              <button
                className="btn-confirm"
                onClick={confirmPurchase}
                disabled={processing}
              >
                {processing ? "Procesando..." : "Sí, comprar"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={processing}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessOverlay && (
        <div className="checkout-success-backdrop">
          <div className="checkout-success">
            <div className="success-check">✓</div>
            <h3>¡Compra lista!</h3>
            <p>Estamos preparando tu pedido.</p>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}

export default Checkout;
