import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import ProductCard from "../../Components//product/ProductCard";
import { useFavorites } from "../../Context/FavoritesContext";
import { getProducts } from "../../mock/Products";
import "../../Styles/Profile.css";
import "../../Styles/Form.css";

function Profile() {
  const [section, setSection] = useState("favorites");

  const navigate = useNavigate()

  const { favorites } = useFavorites();

  const { user, updateProfile, logout } = useAuth();

  const [formData, setFormData] = useState({
      avatar: user?.avatar || "",
      nickname: user?.nickname || "",
      name: user?.name || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      password: user?.password || "",
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      updateProfile(formData);
  };

  const myProducts = getProducts().filter(
  (p) => p.owner === user?.email
);


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
            <p>{user?.nickname ||
    `${user?.name || ""} ${user?.lastname || ""}`.trim() ||
    user?.email}</p>
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
            <ProductCard {...p} />
          </div>
        ))}
      </div>
    )}
  </>
)}
       {section === "posts" && (
  <>
    <h3>Mis publicaciones</h3>
    <div className="profile-divider"></div>

    {myProducts.length === 0 ? (
      <p>No has publicado productos aún</p>
    ) : (
      <div className="row g-3 justify-content-center">
        {myProducts.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-4">
            <ProductCard key={p.id} {...p} showDelete />
          </div>
        ))}
      </div>
    )}
  </>
)}

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
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </div>

          <div className="form-field">
            <label>Apellido</label>
            <input
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Apellido"
            />
          </div>

          <div className="form-field">
            <label>Email</label>
            <input value={formData.email} disabled />
          </div>

          <div className="form-field">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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