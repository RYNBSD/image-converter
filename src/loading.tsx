import Spinner from "react-bootstrap/Spinner";

export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeContent: "center",
      }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
}
