import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import { getProducts } from '../../mock/Products';
import { CartContext } from '../../Context/CartContext';
import { useFavorites } from '../../Context/FavoritesContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useFavorites();

  const product = useMemo(() => {
    return getProducts().find(p => p.id === parseInt(id));
  }, [id]);

  const isFav = isFavorite(id);

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="not-found">
          <h1>Producto no encontrado</h1>
          <p>La zapatilla que buscas no existe</p>
          <button onClick={() => navigate('/catalog')} className="btn-volver">
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    // Podemos agregar una notificación aquí después
    alert(`${product.name} agregada al carrito!`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

  return (
    <div className="product-detail-container">
      <div className="detail-header-top">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver al Catálogo
        </button>
      </div>

      <div className="product-detail">
        <div className="detail-image-section">
          <div className="detail-image-container">
            <img 
              src={product.image} 
              alt={product.name}
              className="detail-image"
            />
            <button 
              className={`favorite-btn-detail ${isFav ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              title="Agregar a favoritos"
            >
              ♥
            </button>
          </div>
        </div>

        <div className="detail-info-section">
          <div className="detail-header">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-brand">{product.brand}</p>
          </div>

          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="review-count">(128 reseñas)</span>
          </div>

          <div className="product-price-detail">
            <span className="price">${product.price.toLocaleString('es-CL')}</span>
            <span className="sustainability">Sostenible</span>
          </div>

          <div className="product-specs">
            <div className="spec-item">
              <span className="spec-label">Talla</span>
              <span className="spec-value">{product.size}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Género</span>
              <span className="spec-value">{product.gender}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Disponibilidad</span>
              <span className="spec-value in-stock">En Stock</span>
            </div>
          </div>

          <div className="product-description">
            <h3>Descripción</h3>
            <p>
              Descubre las {product.name} de {product.brand}. Un diseño clásico y versátil que combina comodidad y estilo. 
              Perfectas para cualquier ocasión, estas zapatillas están fabricadas con materiales sostenibles 
              pensando en el cuidado del medio ambiente.
            </p>
          </div>

          <div className="product-benefits">
            <h3>Beneficios</h3>
            <ul>
              <li>Materiales 100% sostenibles</li>
              <li>Comodidad garantizada</li>
              <li>Diseño duradero</li>
              <li>Envío gratis en compras sobre $50.000</li>
            </ul>
          </div>

          <div className="detail-actions">
            <button 
              onClick={handleAddToCart}
              className="btn-add-to-cart"
            >
              Agregar al Carrito
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="btn-view-cart"
            >
              Ver Carrito
            </button>
          </div>

          <div className="shipping-info">
            <p>Envío a todo Chile</p>
            <p>Cambios y devoluciones en 14 días</p>
            <p>Compra 100% segura</p>
          </div>
        </div>
      </div>

      <div className="related-products-section">
        <h2>Productos Relacionados</h2>
        <p className="coming-soon">Próximamente más zapatillas disponibles</p>
      </div>
    </div>
  );
}

export default ProductDetail;
