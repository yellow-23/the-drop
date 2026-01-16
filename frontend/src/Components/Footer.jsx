import Container from "react-bootstrap/Container";

export default function Footer() {
  return (
    <footer className="bg-light border-top py-3 mt-5">
      <Container className="text-center">
        <small className="text-muted">
          © {new Date().getFullYear()} The Drop
        </small>
      </Container>
    </footer>
  );
}
