import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Footer.css";

export default function Footer() {
  const { user, logout } = useAuth();

  return (
    <footer className="footer-simple">
      <Container>
        <Row className="py-5 gy-4">
          {/* BRAND */}
          <Col xs={12} md={4}>
            <h6 className="footer-heading">THE DROP</h6>
            <p className="footer-text">
              Marketplace de zapatillas. Compra, vende y reutiliza.
            </p>
          </Col>

          {/* NAVEGACIÓN */}
          <Col xs={12} md={4}>
            <h6 className="footer-heading">Navegación</h6>
            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalog">Catálogo</Link></li>

              {user ? (
                <>
                  <li><Link to="/profile">Perfil</Link></li>
                  <li><Link to="/orders">Órdenes</Link></li>
                  <li><Link to="/create-product">Publicar</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Registro</Link></li>
                </>
              )}
            </ul>
          </Col>

          {/* CATEGORÍAS */}
          <Col xs={12} md={4}>
            <h6 className="footer-heading">Categorías</h6>
            <ul className="footer-list">
              <li><Link to="/catalog?type=used">Zapatillas usadas</Link></li>
              <li><Link to="/catalog?type=new">Zapatillas nuevas</Link></li>
              <li><Link to="/catalog?tag=hot">Hot trend</Link></li>
              <li><Link to="/catalog?sort=views">Más vistas</Link></li>
            </ul>
          </Col>
        </Row>

        <div className="footer-divider" />

        <div className="footer-bottom py-4 text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} The Drop. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}

