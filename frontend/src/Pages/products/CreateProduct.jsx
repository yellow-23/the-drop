import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Components/product/ProductCard";
import SuccessModal from "../../Components/utils/SuccessModal";
import publicacionesService from "../../services/publicacionesService";
import imageUploadService from "../../services/imageUploadService";
import brandService from "../../services/brandService";
import sizeService from "../../services/sizeService";
import { useAuth } from "../../Context/AuthContext";
import { useNotification } from "../../Context/NotificationContext";
import "./CreateProduct.css";
import Footer from "../../Components/layout/Footer";

const emptyProduct = {
  titulo: "",
  descripcion: "",
  precio_clp: "",
  condicion: "Usado",
  genero: "",
  marca_id: "",
  talla_id: "",
  imagen_url: "",
  stock: "1",
};

function CreateProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useNotification();

  const [formData, setFormData] = useState(emptyProduct);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result);
    };
    reader.readAsDataURL(file);

    // Subir imagen
    try {
      setUploading(true);
      const response = await imageUploadService.uploadImage(file);
      setFormData({
        ...formData,
        imagen_url: response.imageUrl,
      });
    } catch (error) {
      showError(error.message || "Error al subir imagen");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showError("Debes iniciar sesión para publicar");
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
  stock: Number(formData.stock),
};

      const response = await publicacionesService.createPublicacion(payload);
      
      setShowModal(true);
    } catch (error) {
      console.error(error);
      showError(error.message || "Error al publicar el producto");
    }
  };

  const selectedBrand = brands.find(b => b.id === Number(formData.marca_id));
  const selectedSize = sizes.find(t => t.id === Number(formData.talla_id));

  return (
    <main>
    <div className="container product-create">
      <h3>Publicar producto</h3>
      <div className="profile-divider"></div>

      <div className="content">
        {/* FORM */}
        <div className="form">
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
              <label>Cantidad Disponible</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-field">
              <label>Imagen</label>
              <div className="image-upload-container">
                {/* Preview de imagen */}
                {(imagePreview || formData.imagen_url) && (
                  <div className="image-preview">
                    <img src={imagePreview || formData.imagen_url} alt="Preview" />
                  </div>
                )}
                
                {/* Subida de archivo */}
                <div className="upload-section">
                  <label className="upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={uploading}
                    />
                    <span>{uploading ? 'Subiendo...' : '📁 Seleccionar archivo'}</span>
                  </label>
                </div>

                {/* O URL */}
                <div className="divider">O</div>
                
                <input
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="url-input"
                />
              </div>
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
        <div className="preview">
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

    <SuccessModal
      isOpen={showModal}
      title="¡Publicación Creada!"
      message="Tu zapatilla ha sido publicada exitosamente en el catálogo."
      onClose={() => navigate("/catalog")}
    />

    <Footer />
    </main>
  );
}

export default CreateProduct;
