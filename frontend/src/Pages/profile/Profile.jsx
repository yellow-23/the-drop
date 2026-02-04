import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useNotification } from "../../Context/NotificationContext";
import imageUploadService from "../../services/imageUploadService";
import publicacionesService from "../../services/publicacionesService";
import ProductCard from "../../Components/product/ProductCard";
import { useFavorites } from "../../Context/FavoritesContext";
import "../../Styles/Profile.css";
import "../../Styles/Form.css";

function Profile() {
  const [section, setSection] = useState("favorites");
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { user, updateProfile, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [myProducts, setMyProducts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [formData, setFormData] = useState({
      avatar: user?.avatar || "",
      nombre: user?.nombre || "",
      region: user?.region || "",
      comuna: user?.comuna || "",
    });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result);
    };
    reader.readAsDataURL(file);

    // Subir imagen
    try {
      setUploadingAvatar(true);
      const response = await imageUploadService.uploadImage(file);
      setFormData({
        ...formData,
        avatar: response.imageUrl,
      });
    } catch (error) {
      showError(error.message || "Error al subir avatar");
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
      await updateProfile(formData);
      showSuccess("Perfil actualizado con éxito");
      }
      catch (error) {
          console.error(error);
          showError(error.message || "Error al actualizar el perfil");
      }
  };

  const handleDeletePost = async (id) => {
  const confirmDelete = window.confirm(
    "¿Seguro que deseas eliminar esta publicación?"
  );

  if (!confirmDelete) return;

  try {
    await publicacionesService.deletePublicacion(id);
    setMyProducts(prev => prev.filter(p => p.id !== id));
    showSuccess("Publicación eliminada");
  } catch (error) {
    console.error(error);
    showError("Error al eliminar la publicación");
  }
};

  const displayName = 
  user?.nombre
  ? `${user.nombre}`
  : user?.email

 useEffect(() => {
  if (!user) return;

  const fetchMyProducts = async () => {
    try {
      setLoadingPosts(true);
      const data = await publicacionesService.getUserPublicaciones();
      setMyProducts(data.publicaciones);
    } catch (error) {
      console.error("Error al cargar mis publicaciones", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  fetchMyProducts();
}, [user]);



  return (
    <div className="container-fluid profile-page">
      <div className="row">
        
        {/* SIDEBAR */}
        <aside className="col-12 col-md-3 profile-sidebar">
          <div className="profile-user">
            <div className="avatar" style={{
                backgroundImage: `url(${user?.avatar || "/img/default-avatar.png"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}/>
            <p>{displayName}</p>
          </div>

          <button className="btn-profile" onClick={() => navigate("/create-product")}>
            Crear publicación
          </button>

          <button className="btn-profile-logout" onClick={logout}>
            Cerrar sesión
          </button>

          <nav className="profile-menu">
            <button
              className={section === "favorites" ? "active" : ""}
              onClick={() => setSection("favorites")}
            >
              Mis favoritos
            </button>

            <div className="profile-sidebar-divider">
            </div>

            <button
              className={section === "posts" ? "active" : ""}
              onClick={() => setSection("posts")}
            >
              Mis publicaciones
            </button>
            
             <div className="profile-sidebar-divider">
            </div>

            <button
              className={section === "edit" ? "active" : ""}
              onClick={() => setSection("edit")}
            >
              Editar perfil
            </button>
          </nav>
        </aside>

  {/* CONTENIDO */}
    <main className="col-12 col-md-9 profile-content">

        {/* FAVORITOS */}
          {section === "favorites" && (
  <>
    <h3>Mis favoritos</h3>
    <div className="profile-divider">
    </div>

    {favorites.length === 0 ? (
      <p>No tienes productos en favoritos aún</p>
    ) : (
      <div className="contenido">
        {favorites.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-4">
            <ProductCard 
            {...p} />
          </div>
        ))}
      </div>
    )}
  </>
)}

      {/* MIS PUBLICACIONES */}
       {section === "posts" && (
  <>
    <h3>Mis publicaciones</h3>
    <div className="profile-divider"></div>

    {loadingPosts ? (
      <p>Cargando publicaciones...</p>
    ) : myProducts.length === 0 ? (
      <p>No has publicado productos aún</p>
    ) : (
      <div className="contenido">
        {myProducts.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-4">
            <ProductCard 
            id={p.id}
            titulo={p.titulo}
            precio_clp={p.precio_clp}
            condicion={p.condicion}
            genero={p.genero}
            marca={p.marca}
            talla={p.talla}
            imagen={p.imagenes?.[0]}
            showEdit
            onEdit={(id) => navigate(`/edit-product/${id}`)}
            onDelete={handleDeletePost} />
          </div>
        ))}
      </div>
    )}
  </>
)}

      {/* EDITAR PERFIL */}
          {section === "edit" && (
  <>
    <h3>Editar perfil</h3>
    <div className="profile-divider"></div>

    <div className="contenido">
      <div className="col-12 col-md-8 col-lg-6">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Actualiza tus datos</h2>

          <div className="form-field">
            <label>Avatar</label>
            <div className="avatar-upload-container">
              {/* Preview de avatar */}
              {(avatarPreview || formData.avatar) && (
                <div className="avatar-preview">
                  <img src={avatarPreview || formData.avatar} alt="Avatar Preview" />
                </div>
              )}
              
              {/* Subida de archivo */}
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  disabled={uploadingAvatar}
                />
                <span>{uploadingAvatar ? 'Subiendo...' : '📁 Seleccionar archivo'}</span>
              </label>

              {/* O URL */}
              <div className="divider">O</div>
              
              <input
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://ejemplo.com/avatar.jpg"
                className="url-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Nombre</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </div>

          <div className="form-field">
            <label>Región</label>
            <input
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Región"
            />
          </div>

          <div className="form-field">
            <label>Comuna</label>
            <input
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              placeholder="Comuna"
            />
          </div>


          <button className="form-button">
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  </>
)}
    <footer>
      <div className="text-center text-muted">
          <small>© {new Date().getFullYear()} The Drop</small>
        </div>
    </footer>
        </main>
      </div>
    </div>
    
  );
}

export default Profile
