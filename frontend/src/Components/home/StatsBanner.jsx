import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./StatsBanner.css";

export default function StatsBanner() {
  return (
    <section className="bg-stats-banner">
      <Container>
        <Row className="align-items-center g-4 justify-content-center mb-5">
          <Col md>
            <h2 className="text-center mb-5">Impacto en el medio ambiente 🌱</h2>
            <Row className="text-center g-4">
              <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                <div className="stats-item d-flex justify-content-center align-items-baseline gap-3">
                  <span className="display-5 fw-semibold mb-0">+100</span>
                  <div className="text-start">
                    <div className="fs-4">Zapatillas</div> 
                    <div className="fs-5">reutilizadas</div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stats-item d-flex justify-content-center align-items-baseline gap-3">
                  <span className="display-5 fw-semibold mb-0">+50</span>
                  <div className="text-start">
                    <div className="fs-4">Vendedores</div>
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
