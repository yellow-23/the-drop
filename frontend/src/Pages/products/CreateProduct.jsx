import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Components/product/ProductCard";
import publicacionesService from "../../services/publicacionesService";
import brandService from "../../services/brandService";
import sizeService from "../../services/sizeService";
import { useAuth } from "../../Context/AuthContext";
import "../../Styles/Form.css";

const emptyProduct = {
  titulo: "",
  descripcion: "",
  precio_clp: "",
  condicion: "Usado",
  genero: "",
  marca_id: "",
  talla_id: "",
  imagen_url: "",
};

function CreateProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState(emptyProduct);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
  const loadData = async () => {
    try {
      const brandsRes = await brandService.getBrands();
      const sizesRes = await sizeService.getSizes();

      setBrands(brandsRes);
      setSizes(sizesRes);
    } catch (error) {
      console.error("Error cargando marcas o tallas", error);
    }
  };

  loadData();
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión para publicar");
      return;
    }

    try {
      const payload = {
  titulo: formData.titulo,
  descripcion: formData.descripcion,
  precio_clp: Number(formData.precio_clp),
  condicion: formData.condicion,
  genero: formData.genero,
  marca_id: formData.marca_id,
  talla_id: formData.talla_id,
  imagen_url: formData.imagen_url,
};

      const response = await publicacionesService.createPublicacion(payload);
      
      alert("Producto publicado con exito");
      navigate(`/publications/${response.publicacion.id}`);
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al publicar el producto");
    }
  };

  const selectedBrand = brands.find(b => b.id === Number(formData.marca_id));
  const selectedSize = sizes.find(t => t.id === Number(formData.talla_id));

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
              <input name="titulo" value={formData.titulo} onChange={handleChange} />
            </div>

            <div className="form-field">
            <label>Marca</label>
            <select
             name="marca_id"
             value={formData.marca_id}
             onChange={handleChange}
            required
            >
          <option value="">Seleccionar marca</option>
           {brands.map((m) => (
          <option key={m.id} value={m.id}>
          {m.nombre}
        </option>
         ))}
        </select>
        </div>

          <div className="form-field">
            <label>Talla (CL)</label>
            <select
            name="talla_id"
            value={formData.talla_id}
            onChange={handleChange}
            required
            >
              <option value="">Seleccionar talla</option>
                  {sizes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.talla_cl}
              </option>
               ))}
          </select>
          </div>

            <div className="form-field">
              <label>Género</label>
              <select name="genero" value={formData.genero} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option>Hombre</option>
                <option>Mujer</option>
                <option>Unisex</option>
              </select>
            </div>

            <div className="form-field">
              <label>Estado</label>
              <select
                name="condicion"
                value={formData.condicion}
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
                name="precio_clp"
                value={formData.precio_clp}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Imagen (URL)</label>
              <input
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="form-field">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                rows="3"
                value={formData.descripcion}
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
            titulo={formData.titulo}
            genero={formData.genero}
            condicion={formData.condicion}
            precio_clp={formData.precio_clp || 0}
            marca={selectedBrand?.nombre}
            talla={selectedSize?.talla_cl}
            imagen={formData.imagen_url || "/img/shoe.png"}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
