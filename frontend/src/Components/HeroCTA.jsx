import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./HeroCTA.css";

export default function HeroCTA() {
  return (
  <section className="bg-light rounded-4 p-4 my-4">
  <Container>
    <Row className="align-items-center gx-2">
      <Col md={8}>
        <h1 className="h3 mb-2 text-uppercase">THE DROP MARKETPLACE</h1>
        <p className="mb-1">Compra y vende zapatillas nuevas o usadas</p>
        <p className="mb-0 text-muted">Sé parte de la economía circular</p>
      </Col>

      <Col md={4} className="d-flex justify-content-md-end gap-3 mt-3 mt-md-0">
        <Button variant="secondary" className="button-cta-hero rounded-pill px-4">
          Comprar
        </Button>
        <Button variant="light" className="rounded-pill px-4 border">
          Vender
        </Button>
      </Col>
    </Row>
  </Container>
</section>

  );
}
