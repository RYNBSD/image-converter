import { memo, useMemo } from "react";
import { X } from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { type Process, useProcess } from "../contexts/process";
import { useTheme } from "../contexts/theme";

const ProgressCard = memo(({ process }: { process: Process }) => {
  const { theme } = useTheme()!;
  const { removeProcess } = useProcess()!;

  const pendingStatus = useMemo(
    () =>
      process.status === "pending-read"
        ? "Reading"
        : process.status === "pending-convert"
        ? "Converting"
        : process.status === "pending-download"
        ? "Downloading"
        : null,
    [process.status]
  );

  const processStatus = useMemo(
    () =>
      process.status === "converting"
        ? "Converting"
        : process.status === "downloading"
        ? "Downloading"
        : process.status === "error"
        ? process.error?.message
        : process.status === "success"
        ? "Success"
        : null,
    [process.error?.message, process.status]
  );

  const isDone = useMemo(
    () => process.status === "error" || process.status === "success",
    [process.status]
  );

  return (
    <Card
      className="mb-2"
      border="primary"
      style={{ width: "350px" }}
      bg={
        process.status === "error"
          ? "danger"
          : process.status === "success"
          ? "success"
          : pendingStatus
          ? "warning"
          : "info"
      }
    >
      <Card.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h5 className="text-truncate" style={{ maxWidth: "80%" }}>
          {process.file.name}
        </h5>
        <Button
          type="button"
          disabled={!isDone}
          variant={theme === "light" ? "dark" : "light"}
          onClick={() => (isDone ? removeProcess(process.id) : null)}
        >
          <X />
        </Button>
      </Card.Header>
      <Card.Body>
        {pendingStatus && <h6>Preparing for {pendingStatus}</h6>}
        {process.status === "reading" && (
          <ProgressBar
            animated
            now={process.progress}
            label={`${process.progress}%`}
            variant="info"
          />
        )}
        {processStatus && <p>{processStatus}</p>}
      </Card.Body>
    </Card>
  );
});

export default function Progress() {
  const { processes } = useProcess()!;
  return (
    processes.length > 0 && (
      <Container as="div" fluid className="my-2 overflow-auto">
        <Row className="flex-row flex-nowrap gap-2">
          {processes.map((process) => (
            <ProgressCard key={process.id} process={process} />
          ))}
        </Row>
      </Container>
    )
  );
}
