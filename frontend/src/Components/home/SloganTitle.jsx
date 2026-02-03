import Container from "react-bootstrap/Container";
import "./SloganTitle.css";

export default function SloganTitle() {
  return (
    <section className="slogan-section">
      <Container className="text-center">
        <h2 className="slogan-title">Dale una segunda vida a tus zapatillas</h2>
        <p className="slogan-subtitle">
          Compra, vende y reutiliza de forma consciente
        </p>
        <div className="slogan-divider"></div>
      </Container>
    </section>
  );
}
