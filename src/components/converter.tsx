import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import { type ChangeEvent, type DragEvent, useCallback, useState } from "react";

import { useConvert } from "../contexts/convert";
import { JIMP_MIME_KEYS, type JimpMimeKeys } from "../libs/jimp";
import { useWindowSize } from "../hooks/useWindowSize";
import { useTheme } from "../contexts/theme";

export default function Converter() {
  const { theme } = useTheme()!;
  const { options, convert, changeOption } = useConvert()!;

  const innerWith = useWindowSize();
  const [dragging, setDragging] = useState(false);

  // Handles drag over event to show visual feedback
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  // Handles drag leave event to remove visual feedback
  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  // Handles drop event and passes the files to the convert function
  const onDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length === 0) return;

      const files: File[] = [];
      for (let i = 0; i < droppedFiles.length; i++) {
        files.push(droppedFiles[i]);
      }

      await convert(files);
    },
    [convert]
  );

  // Handles file input change event for manual file selection
  const onFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const inputFiles = e.target.files;
      if (inputFiles === null) return;

      const files: File[] = [];
      for (let i = 0; i < inputFiles.length; i++) {
        files.push(inputFiles[i]);
      }

      await convert(files);
    },
    [convert]
  );

  return (
    <Container as="div" className="my-2" style={{ height: "75vh" }}>
      <Container
        as="section"
        style={{
          display: "flex",
          flexDirection: "column",
          border: dragging ? "2px dashed #007bff" : "2px dashed #ccc",
          gap: 10,
          padding: 20,
          height: "100%",
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Stack
          direction={innerWith >= 400 ? "horizontal" : "vertical"}
          style={{ gap: 25, width: "100%" }}
        >
          <Form.Select
            value={options.format}
            className="flex-grow-1"
            onChange={(e) =>
              changeOption("format", e.target.value as JimpMimeKeys)
            }
          >
            {JIMP_MIME_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Form.Select>
          <InputGroup className="flex-grow-1">
            <InputGroup.Text>Width</InputGroup.Text>
            <Form.Control
              type="number"
              value={options.width}
              placeholder="Width"
              min={0}
              onChange={(e) => {
                changeOption("width", Number.parseInt(e.target.value));
              }}
            />
          </InputGroup>
          <InputGroup className="flex-grow-1">
            <InputGroup.Text>Height</InputGroup.Text>
            <Form.Control
              type="number"
              value={options.height}
              placeholder="Height"
              min={0}
              onChange={(e) => {
                changeOption("height", Number.parseInt(e.target.value));
              }}
            />
          </InputGroup>
        </Stack>
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        <Form.Label
          htmlFor="fileInput"
          className={theme === "dark" ? "bg-white text-black" : "bg-black text-white"}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {dragging
            ? "Release to Upload"
            : "Drag and Drop Files or Click to Select"}
        </Form.Label>
      </Container>
    </Container>
  );
}
