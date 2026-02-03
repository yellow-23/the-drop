import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./HeroCTA.css";
import handDrop from "../../assets/img/hand-drop.png";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function HeroCTA() {
  return (
    <section className="bg-hero-cta">
      <Container className="position-relative" style={{ zIndex: 1 }}>
        <Row className="align-items-center gx-4">
          <Col lg={2} className="d-none d-lg-block">
            <img className="hand-drop" src={handDrop} alt="Hand Drop" />
          </Col>
          <Col lg={5} xs={12} className="mb-4 mb-lg-0">
            <h1 className="color-text-hero mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1.2 }}>
              THE DROP<br />
              <span style={{ color: '#c8ff00' }}>MARKETPLACE</span>
            </h1>
            <p className="color-text-hero mb-2" style={{ fontSize: '1.125rem', opacity: 0.95 }}>
              Compra y vende zapatillas nuevas o usadas
            </p>
            <p className="color-text-hero mb-0" style={{ fontSize: '1.125rem', opacity: 0.9 }}>Sé parte de la economía circular</p>
          </Col>
          <Col lg={5} xs={12} className="d-flex flex-column gap-3 justify-content-lg-end">
            <Button
              as={NavLink}
              to="/catalog"
              className="button-cta-hero button-cta-hero_primary"
            >
              ✨ Explorar Catálogo
            </Button>
            <Button
              as={NavLink}
              to="/create-product"
              className="button-cta-hero button-cta-hero_variant"
            >
              📦 Comienza a Vender
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
