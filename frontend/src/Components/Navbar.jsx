import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          The Drop
        </Link>

        {/* DESKTOP */}
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/catalog">Catálogo</NavLink>

          {user && (
            <>
              <NavLink to="/cart">Carrito</NavLink>
              <NavLink to="/profile">Perfil</NavLink>
              <NavLink to="/create-product">Publicar</NavLink>
              <button className="nav-link-btn logout-btn" onClick={logout}>Salir</button>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/register">Registro</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </nav>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {/* MOBILE */}
      {menuOpen && (
        <nav className="mobile-menu" onClick={closeMenu}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/catalog">Catálogo</NavLink>

          {user && (
            <>
              <NavLink to="/cart">Carrito</NavLink>
              <NavLink to="/profile">Perfil</NavLink>
              <NavLink to="/create-product">Publicar</NavLink>
              <button className="logout-btn">Salir</button>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/register">Registro</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
