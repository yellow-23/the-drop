import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-simple">
      <Container>
        <Row className="py-5 gy-4">
          <Col xs={12} md={4}>
            <h6 className="footer-heading">THE DROP</h6>
            <p className="footer-text">Marketplace de zapatillas. Compra, vende y reutiliza.</p>
          </Col>
          <Col xs={12} md={4}>
            <h6 className="footer-heading">Navegación</h6>
            <ul className="footer-list">
              <li><a href="/">Home</a></li>
              <li><a href="/catalog">Catálogo</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Registro</a></li>
            </ul>
          </Col>
          <Col xs={12} md={4}>
            <h6 className="footer-heading">Categorías</h6>
            <ul className="footer-list">
              <li><a href="/catalog?type=used">Zapatillas usadas</a></li>
              <li><a href="/catalog?type=new">Zapatillas nuevas</a></li>
              <li><a href="/catalog?tag=hot">Hot trend</a></li>
              <li><a href="/catalog?sort=views">Más vistas</a></li>
            </ul>
          </Col>
        </Row>
        
        <div className="footer-divider"></div>
        
        <div className="footer-bottom py-4 text-center">
          <p className="mb-0">© {new Date().getFullYear()} The Drop. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}
