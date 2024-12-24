import Container from "react-bootstrap/Container";
import { Converter, Footer, NavBar, Progress } from "./components";

export default function App() {
  return (
    <>
      <NavBar />
      <Container as="main" style={{ width: "100vw", minHeight: "100vh" }}>
        <Progress />
        <Converter />
      </Container>
      <Footer />
    </>
  );
}
