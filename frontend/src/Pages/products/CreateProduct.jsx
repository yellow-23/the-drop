import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Components/product/ProductCard";
import { addProduct } from "../../mock/Products";
import { useAuth } from "../../Context/AuthContext";
import "../../Styles/Form.css";

const emptyProduct = {
  name: "",
  brand: "",
  size: "",
  gender: "",
  condition: "Nuevo",
  price: "",
  image: "",
  description: "",
};

function CreateProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState(emptyProduct);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión para publicar");
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...formData,
      price: Number(formData.price),
      owner: user.email,
    };

    addProduct(newProduct);
    alert("Producto publicado");
    navigate(`/product/${newProduct.id}`);

  };

  return (
    <div className="container product-create">
      <h3>Publicar producto</h3>
      <div className="profile-divider"></div>

      <div className="row justify-content-center align-items-start">
        {/* FORM */}
        <div className="col-12 col-md-6">
          <form className="form-card" onSubmit={handleSubmit}>
            <h2 className="form-title">Datos del producto</h2>

            <div className="form-field">
              <label>Nombre</label>
              <input name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>Marca</label>
              <input name="brand" value={formData.brand} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>Talla</label>
              <input name="size" value={formData.size} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>Género</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option>Hombre</option>
                <option>Mujer</option>
                <option>Unisex</option>
              </select>
            </div>

            <div className="form-field">
              <label>Estado</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option>Nuevo</option>
                <option>Usado</option>
              </select>
            </div>

            <div className="form-field">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Imagen (URL)</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/img/shoe.png"
              />
            </div>

            <div className="form-field">
              <label>Descripción</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button className="form-button">Publicar</button>
          </form>
        </div>

        {/* PREVIEW */}
        <div className="col-12 col-md-5">
          <h2 className="form-title text-center">Vista previa</h2>

          <ProductCard
            {...formData}
            price={formData.price || 0}
            image={formData.image || "/img/shoe.png"}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
