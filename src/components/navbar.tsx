import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";

export default function Navbar() {
  return (
    <BootstrapNavbar expand="lg" className="bg-body-tertiary">
      <Container>
        <BootstrapNavbar.Brand href="#home">
          Image Converter
        </BootstrapNavbar.Brand>
        <Nav>
          <Nav.Link href="https://buymeacoffee.com/rynbsd04a" target="_blank">
            Support
          </Nav.Link>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
}
