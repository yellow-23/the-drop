import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./StatsBanner.css";
import globe from "../assets/img/globe.png";

export default function StatsBanner() {
  return (
    <section className="bg-stats-banner py-5 mb-0">
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
            <h2 className="text-light text-center mb-3">Impacto Ambiental</h2>
            <Row className="text-light text-center g-4">
              <Col sm={6}>
                <div className="d-flex justify-content-center align-items-baseline gap-2 text-light">
                  <span className="display-5 fw-semibold mb-0">+100</span>
                  <div className="text-light text-start">
                    <div className="fs-4">zapatillas</div> 
                    <div className="fs-5">reutilizadas</div>
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div className="d-flex justify-content-center align-items-baseline gap-2 text-light">
                  <span className="display-5 fw-semibold mb-0">+50</span>
                  <div className="text-lighttext-start">
                    <div className="fs-4">vendedores</div>
                    <div className="fs-5">activos</div>
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
