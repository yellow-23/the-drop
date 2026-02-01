import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
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
  const [myProducts, setMyProducts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);


  const [formData, setFormData] = useState({
      avatar: user?.avatar || "",
      nickname: user?.nickname || "",
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      region: user?.region || "",
      comuna: user?.comuna || "",
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
      await updateProfile(formData);
      alert("Perfil actualizado con exito");
      }
      catch (error) {
          console.error(error);
          alert(error.message || "Error al actualizar el perfil");
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
    alert("Publicación eliminada");
  } catch (error) {
    console.error(error);
    alert("Error al eliminar la publicación");
  }
};

  const displayName = 
  user?.nickname 
  ? user.nickname
  : user?.nombre || user?.apellido
  ? `${user.nombre || ""} ${user.apellido || ""}`
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

          <button className="btn btn-light w-100 mb-3" onClick={() => navigate("/create-product")}>
            Crear publicación
          </button>

          <button className="btn btn-outline-light w-100 mb-4" onClick={logout}>
            Cerrar sesión
          </button>

          <nav className="profile-menu">
            <button
              className={section === "favorites" ? "active" : ""}
              onClick={() => setSection("favorites")}
            >
              Mis favoritos
            </button>

            <div className="profile-divider">
            </div>

            <button
              className={section === "posts" ? "active" : ""}
              onClick={() => setSection("posts")}
            >
              Mis publicaciones
            </button>
            
             <div className="profile-divider">
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
      <div className="row g-3 justify-content-center">
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
      <div className="row g-3 justify-content-center">
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
            showDelete
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

    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Actualiza tus datos</h2>

          <div className="form-field">
            <label>Avatar (URL)</label>
            <input
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-field">
            <label>Nickname</label>
            <input
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Nickname"
            />
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
            <label>Apellido</label>
            <input
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
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
        </main>
      </div>
    </div>
  );
}

export default Profile
