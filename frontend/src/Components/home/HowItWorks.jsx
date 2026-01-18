import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./HowItWorks.css";

import dropSneaker from "../../assets/img/dropsneaker.png";
import secure from "../../assets/img/secure.png";
import recycle from "../../assets/img/recycle.png";
import life from "../../assets/img/life.png";

export default function HowItWorks() {
  return (
    <section className="howitworks">
      <Container>
        <h2 className="howitworks__title text-center mb-4">¿Cómo Funciona?</h2>
        <Row className="g-4 justify-content-center">
          <Col xs={10} sm={6} md={3}>
            <div className="howitworks__card">
              <img className="howitworks__icon" src={dropSneaker} alt="Publica" />
              <p className="howitworks__text">Publica tus<br />zapatillas</p>
            </div>
          </Col>

          <Col xs={10} sm={6} md={3}>
            <div className="howitworks__card">
              <img className="howitworks__icon" src={secure} alt="Seguro" />
              <p className="howitworks__text">Compra de<br />forma segura</p>
            </div>
          </Col>

          <Col xs={10} sm={6} md={3}>
            <div className="howitworks__card">
              <img className="howitworks__icon" src={recycle} alt="Reutiliza" />
              <p className="howitworks__text">Reutiliza y cuida<br />el planeta</p>
            </div>
          </Col>

          <Col xs={10} sm={6} md={3}>
            <div className="howitworks__card">
              <img className="howitworks__icon" src={life} alt="Segunda vida" />
              <p className="howitworks__text">Dale una<br />segunda vida</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
