import { NavLink, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useContext(CartContext);

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

          <NavLink to="/cart">
            Carrito ({cartItems?.length ?? 0})
          </NavLink>

          <NavLink to="/register">Registro</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>

        {/* Botón de menú móvil */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav className="mobile-menu" onClick={closeMenu}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/catalog">Catálogo</NavLink>

          <NavLink to="/cart">
            Carrito ({cartItems?.length ?? 0})
          </NavLink>

          <NavLink to="/register">Registro</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
