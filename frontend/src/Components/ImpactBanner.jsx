import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import globe from "../assets/img/globe.png";

export default function ImpactBanner() {
  return (
    <section className="bg-light p-4 my-5">
      <Container>
        <Row className="align-items-center g-4 justify-content-center">
          <Col xs="auto" className="text-center">
            <img
              src={globe}
              alt="Impacto ambiental"
              className="d-block mx-auto"
              style={{ width: 110, height: 110, objectFit: "contain" }}
            />
          </Col>
          <Col md>
            <h2 className="text-center mb-3">Impacto Ambiental</h2>
            <Row className="text-center g-4">
              <Col sm={6}>
                <div className="d-flex justify-content-center align-items-baseline gap-2">
                  <span className="display-5 fw-semibold mb-0">+100</span>
                  <div className="text-start">
                    <div className="fs-4">zapatillas</div>
                    <div className="fs-5 text-muted">reutilizadas</div>
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div className="d-flex justify-content-center align-items-baseline gap-2">
                  <span className="display-5 fw-semibold mb-0">+50</span>
                  <div className="text-start">
                    <div className="fs-4">vendedores</div>
                    <div className="fs-5 text-muted">activos</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
