import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { MoonFill, SunFill } from "react-bootstrap-icons";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { useTheme } from "../contexts/theme";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()!;
  return (
    <BootstrapNavbar expand="lg">
      <Container>
        <BootstrapNavbar.Brand href="#">Image Converter</BootstrapNavbar.Brand>
        <Nav>
          <Nav.Link href="https://buymeacoffee.com/rynbsd04a" target="_blank">
            Support
          </Nav.Link>
          <Nav.Link as="span">
            <Button
              type="button"
              variant={theme === "light" ? "dark" : "light"}
              onClick={() => toggleTheme()}
            >
              {theme === "light" ? <MoonFill /> : <SunFill />}
            </Button>
          </Nav.Link>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
}
