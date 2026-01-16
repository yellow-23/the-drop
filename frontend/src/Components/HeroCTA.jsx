import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./HeroCTA.css";

export default function HeroCTA() {
  return (
  <section className="bg-hero-cta p-4 my-4">
  <Container>
    <Row className="align-items-center gx-2">
      <Col md={8}>
        <h1 className="color-text-hero h3 mt-4 mb-2 text-uppercase">THE DROP MARKETPLACE</h1>
        <p className="color-text-hero mb-0">Compra y vende zapatillas nuevas o usadas</p>
        <p className="color-text-hero mb-0">Sé parte de la economía circular</p>
      </Col>

      <Col md={4} className="d-flex justify-content-md-end gap-3 mt-3 mt-md-0">
        <Button variant="secondary" size="lg" className="button-cta-hero 	button-cta-hero_primary rounded-pill px-6">
          Comprar
        </Button>
        <Button size="lg" className="button-cta-hero 	button-cta-hero_variant rounded-pill px-6">
          Vender
        </Button>
      </Col>
    </Row>
  </Container>
</section>

  );
}
