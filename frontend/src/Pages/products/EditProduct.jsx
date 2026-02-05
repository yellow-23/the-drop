import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import publicacionesService from "../../services/publicacionesService";
import brandService from "../../services/brandService";
import sizeService from "../../services/sizeService";
import { useAuth } from "../../Context/AuthContext";
import { useNotification } from "../../Context/NotificationContext";
import "./EditProduct.css";
import "./CreateProduct.css";
import Footer from "../../Components/layout/Footer";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const brandsRes = await brandService.getBrands();
        const sizesRes = await sizeService.getSizes();
        const productRes = await publicacionesService.getPublicacionById(id);

        setBrands(brandsRes);
        setSizes(sizesRes);
        setFormData({
          titulo: productRes.publicacion.titulo,
          descripcion: productRes.publicacion.descripcion,
          precio_clp: productRes.publicacion.precio_clp,
          condicion: productRes.publicacion.condicion,
          genero: productRes.publicacion.genero,
          marca_id: productRes.publicacion.marca_id,
          talla_id: productRes.publicacion.talla_id,
          imagen_url: productRes.publicacion.imagenes?.[0] || "",
        });
      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.precio_clp || !formData.marca_id || !formData.talla_id) {
      showError("Completa todos los campos obligatorios");
      return;
    }

    try {
      await publicacionesService.updatePublicacion(id, {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio_clp: formData.precio_clp,
        condicion: formData.condicion,
        genero: formData.genero,
        marca_id: formData.marca_id,
        talla_id: formData.talla_id,
      });

      showSuccess("Producto actualizado correctamente");
      navigate("/profile");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      showError("Error al actualizar el producto");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!formData) return <p>Error cargando el producto</p>;

  return (
    <main>
      <div className="create-product-container">
        <div className="create-header">
          <h1>Editar Zapatilla</h1>
          <p>Actualiza los detalles de tu producto</p>
        </div>

        <div className="create-content">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="titulo">Nombre *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Nike Air Max..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe tu zapatilla..."
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio_clp">Precio (CLP) *</label>
                <input
                  type="number"
                  id="precio_clp"
                  name="precio_clp"
                  value={formData.precio_clp}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="condicion">Condición *</label>
                <select
                  id="condicion"
                  name="condicion"
                  value={formData.condicion}
                  onChange={handleChange}
                  required
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="genero">Género</label>
                <input
                  type="text"
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  placeholder="Hombre/Mujer/Unisex"
                />
              </div>

              <div className="form-group">
                <label htmlFor="marca_id">Marca *</label>
                <select
                  id="marca_id"
                  name="marca_id"
                  value={formData.marca_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="talla_id">Talla *</label>
              <select
                id="talla_id"
                name="talla_id"
                value={formData.talla_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una talla</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Guardar Cambios
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/profile")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default EditProduct;
