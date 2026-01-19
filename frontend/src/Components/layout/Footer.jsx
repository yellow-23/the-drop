import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

export default function Footer() {
  return (
    <footer className="bg-light border-top py-4">
      <Container>
        <Row className="gy-4">
          <Col xs={12} md={6}>
            <h6 className="text-uppercase mb-3">Menú</h6>
            <Nav className="flex-column gap-2">
              <Nav.Link href="/" className="p-0 text-muted">Home</Nav.Link>
              <Nav.Link href="/catalog" className="p-0 text-muted">Galería</Nav.Link>
              <Nav.Link href="/login" className="p-0 text-muted">Login</Nav.Link>
              <Nav.Link href="/register" className="p-0 text-muted">Registro</Nav.Link>
            </Nav>
          </Col>
          <Col xs={12} md={6}>
            <h6 className="text-uppercase mb-3">Categorías</h6>
            <Nav className="flex-column gap-2">
              <Nav.Link href="/catalog?type=used" className="p-0 text-muted">Zapatillas usadas</Nav.Link>
              <Nav.Link href="/catalog?type=new" className="p-0 text-muted">Zapatillas nuevas</Nav.Link>
              <Nav.Link href="/catalog?tag=hot" className="p-0 text-muted">Hot trend 🔥</Nav.Link>
              <Nav.Link href="/catalog?sort=views" className="p-0 text-muted">Más vistas 👀</Nav.Link>
            </Nav>
          </Col>
        </Row>

        <hr className="my-4" />

        <div className="text-center text-muted">
          <small>© {new Date().getFullYear()} The Drop</small>
        </div>
      </Container>
    </footer>
  );
}
