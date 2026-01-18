import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { mockProducts } from "../mock/Products";
import "../Styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const product = mockProducts.find(
    (p) => p.id === Number(id)
  );

  if (!product) {
    return <p>Producto no encontrado</p>;
  }

  return (
    <div className="container product-detail">
     <h3>Mi carrito de compras</h3>
     <div className="profile-divider"></div>
      <button className="back-btn" onClick={() => navigate("/catalog")}>
        ← Volver al catálogo
      </button>

      <div className=" row justify-content-center align-items-center">
        {/* IMAGEN */}
        <div className="col-12 col-md-5 text-center">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        {/* INFO */}
        <div className="col-12 col-md-6 product-detail-info">
          <h2>{product.name}</h2>

          <p><strong>Marca:</strong> {product.brand}</p>
          <p><strong>Género:</strong> {product.gender}</p>
          <p><strong>Talla:</strong> {product.size}</p>
          <p><strong>Estado:</strong> {product.condition}</p>

          <p className="price">${product.price}</p>

          <p className="description">{product.description}</p>

          <button
            className="add-cart-btn"
            onClick={() => {
            addToCart(product);
            alert("Producto agregado al carrito");
         }}
            >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
