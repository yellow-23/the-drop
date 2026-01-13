import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          The Drop
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/catalog">Catálogo</NavLink>
          <NavLink to="/cart">Carrito</NavLink>
          <NavLink to="/register">Registro</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>

        {/* Boton de menú movil */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">☰</button>
      </div>

      {/* Menu movil */}
      {menuOpen && (
        <nav className="mobile-menu" onClick={closeMenu}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/catalog">Catálogo</NavLink>
          <NavLink to="/cart">Carrito</NavLink>
          <NavLink to="/register">Registro</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      )}
    </header>
  );
}

export default Navbar;