import { useState, useEffect } from "react";
import orderService from "../../services/orderService";
import { useAuth } from "../../Context/AuthContext";
import Footer from "../../Components/layout/Footer";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrders();
        setOrders(response.orders || []);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) return <p>Cargando órdenes...</p>;

  return (
    <main>
      <div className="orders-container">
        <div className="orders-header">
          <h1>Mis Órdenes</h1>
          <p>Historial de compras y estado de entregas</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No tienes órdenes aún</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Orden #{order.id}</span>
                  <span className={`order-status status-${order.estado?.toLowerCase()}`}>
                    {order.estado}
                  </span>
                </div>
                <div className="order-details">
                  <p><strong>Fecha:</strong> {new Date(order.creado_en).toLocaleDateString('es-CL')}</p>
                  <p><strong>Total:</strong> ${order.total_clp?.toLocaleString('es-CL')}</p>
                  <p><strong>Región:</strong> {order.region_envio}</p>
                  <p><strong>Comuna:</strong> {order.comuna_envio}</p>
                  <p><strong>Dirección:</strong> {order.direccion}</p>
                </div>
                <div className="order-items">
                  <strong>Cantidad de productos:</strong> {order.item_count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default Orders;
