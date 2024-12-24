import type { ChildrenProps } from "../types/props";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Jimp, JIMP_MIME, type JimpMimeKeys } from "../libs/jimp";
import { type Process, useProcess } from "./process";
import { delay } from "../utils/delay";

type Options = {
  format: JimpMimeKeys;
  width: number;
  height: number;
};

type OptionsKey = keyof Options;
type OptionsValue<K extends OptionsKey> = Options[K];

type ConvertValue = {
  options: Options;
  convert: ConvertFn;
  changeOption: ChangeOptionFn;
};

const ConvertContext = createContext<ConvertValue | null>(null);

type ConvertFn = (files: File[]) => Promise<void>;

type ChangeOptionFn = <K extends OptionsKey>(
  key: K,
  value: OptionsValue<K>
) => void;

export default function ConvertProvider({ children }: ChildrenProps) {
  const { processes, addProcesses, updateProcess, removeProcess } =
    useProcess()!;

  const [options, setOptions] = useState<Options>({
    format: "png",
    width: 0,
    height: 0,
  });

  const changeOption = useCallback<ChangeOptionFn>((key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const generateId = useCallback(() => {
    return Math.round(Date.now() * Math.random());
  }, []);

  const download = useCallback(
    async (process: Process) => {
      updateProcess(process.id, "status", "downloading");

      if (import.meta.env.DEV) {
        await delay(1000);
      }

      const blob = new Blob([process.buffer!], {
        type: JIMP_MIME[options.format],
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const newFileName = process.file.name.split(".")[0];
      a.download = `${newFileName}.${options.format}`;

      a.click();
      updateProcess(process.id, "status", "success");
    },
    [options.format, updateProcess]
  );

  useEffect(() => {
    if (processes.length === 0) return;

    if (import.meta.env.DEV) {
      console.log(processes);
    }

    processes.forEach((process) => {
      if (process.status === "pending-download") {
        (async () => {
          await download(process);
          await delay(3000);
          removeProcess(process.id);
        })();
      }
    });
  }, [download, processes, removeProcess]);

  const core = useCallback(
    (process: Process) => {
      return new Promise<null>((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = async () => {
          updateProcess(process.id, "status", "converting");

          if (import.meta.env.DEV) {
            await delay(1000);
          }

          let buffer: Buffer;
          try {
            const image = await Jimp.read(fileReader.result!);
            buffer = await image
              .resize({
                w: options.width > 0 ? options.width : image.width,
                h: options.height > 0 ? options.height : image.height,
              })
              .getBuffer(JIMP_MIME[options.format]);
          } catch (error) {
            updateProcess(process.id, "status", "error");
            updateProcess(process.id, "error", error as Error);
            return reject(null);
          }

          updateProcess(process.id, "buffer", buffer);
          updateProcess(process.id, "status", "pending-download");
          resolve(null);
        };

        fileReader.onloadstart = () => {
          updateProcess(process.id, "status", "reading");
        };

        fileReader.onprogress = (e) => {
          if (e.loaded === e.total) {
            updateProcess(process.id, "status", "pending-convert");
          }
          updateProcess(process.id, "progress", e.loaded / e.total);
        };

        // fileReader.onloadend = () => {
        //   updateProcess(process.id, "status", "pending-convert");
        // };

        fileReader.onerror = () => {
          updateProcess(process.id, "status", "error");
          updateProcess(process.id, "error", fileReader.error);
          reject(null);
        };

        fileReader.readAsArrayBuffer(process.file);
      });
    },
    [options.format, options.height, options.width, updateProcess]
  );

  const convert = useCallback<ConvertFn>(
    async (files) => {
      if (files.length === 0) return;

      const newProcesses = files.map<Process>((file) => ({
        id: generateId(),
        file,
        progress: 0,
        status: "pending-read",
        buffer: null,
        error: null,
      }));

      addProcesses(newProcesses);

      if (import.meta.env.DEV) {
        await delay(1000);
      }

      await Promise.allSettled(newProcesses.map((file) => core(file)));
    },
    [addProcesses, core, generateId]
  );

  return (
    <ConvertContext.Provider value={{ options, convert, changeOption }}>
      {children}
    </ConvertContext.Provider>
  );
}

export const useConvert = () => useContext(ConvertContext);
