import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import { useState } from "react";

import { useConvert } from "../context/convert";
import {
  JIMP_MIME_KEYS,
  JIMP_MIME_VALUES,
  type JimpMimeValues,
} from "../lib/jimp";

export default function Converter() {
  const { wait, options, convert, changeOption } = useConvert()!;

  const [dragging, setDragging] = useState(false);

  // Handles drag over event to show visual feedback
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  // Handles drag leave event to remove visual feedback
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handles drop event and passes the files to the convert function
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length === 0) return;

    const files: File[] = [];
    for (let i = 0; i < droppedFiles.length; i++) {
      files.push(droppedFiles[i]);
    }

    convert(files);
  };

  // Handles file input change event for manual file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;
    if (inputFiles === null) return;

    const files: File[] = [];
    for (let i = 0; i < inputFiles.length; i++) {
      files.push(inputFiles[i]);
    }

    convert(files);
  };

  return (
    <Container as="div" className="add-wrapper">
      <div>Ads</div>
      <Container
        as="section"
        style={{
          display: "grid",
          placeContent: "center",
          rowGap: 10,
          border: dragging ? "2px dashed #007bff" : "2px dashed #ccc",
          padding: 20,
          maxWidth: "800px",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          disabled={wait > 0}
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          style={{
            background: dragging ? "#007bff" : "#f0f0f0",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          {dragging
            ? "Release to Upload"
            : "Drag and Drop Files or Click to Select"}
        </label>

        <Stack
          direction="horizontal"
          style={{ gap: 25, maxWidth: 800, minWidth: 400 }}
        >
          <Form.Select
            value={options.format}
            onChange={(e) =>
              changeOption("format", e.target.value as JimpMimeValues)
            }
          >
            {JIMP_MIME_KEYS.map((key, i) => (
              <option key={i} value={JIMP_MIME_VALUES[i]}>
                {key}
              </option>
            ))}
          </Form.Select>
          <InputGroup>
            <InputGroup.Text>Width</InputGroup.Text>
            <Form.Control
              type="number"
              value={options.width}
              placeholder="Width"
              min={0}
              onChange={(e) =>
                changeOption("width", Number.parseInt(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Height</InputGroup.Text>
            <Form.Control
              type="number"
              value={options.height}
              placeholder="Height"
              min={0}
              onChange={(e) =>
                changeOption("height", Number.parseInt(e.target.value))
              }
            />
          </InputGroup>
        </Stack>
      </Container>
      <div>Ads</div>
    </Container>
  );
}
