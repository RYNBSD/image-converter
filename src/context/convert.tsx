import type { ChildrenProps } from "../types/props";
import { createContext, useCallback, useContext, useState } from "react";
import { Jimp, JimpMimeValues } from "../lib/jimp";

type Options = {
  format: JimpMimeValues;
  width: number;
  height: number;
};

type OptionsKey = keyof Options;
type OptionsValue<K extends OptionsKey> = Options[K];

type ConvertValue = {
  wait: number;
  options: Options;
  convert: (files: File[]) => void;
  changeOption: <K extends OptionsKey>(key: K, value: OptionsValue<K>) => void;
};

const ConvertContext = createContext<ConvertValue | null>(null);

export function ConvertProvider({ children }: ChildrenProps) {
  const [wait, setWait] = useState(0);
  const [options, setOptions] = useState<Options>({
    format: "image/png",
    width: 1000,
    height: 1000,
  });

  const changeOption = useCallback(
    <K extends OptionsKey>(key: K, value: OptionsValue<K>) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const convert = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      setWait(files.length);
      for (const file of files) {
        const fileReader = new FileReader();

        fileReader.onload = async () => {
          try {
            const image = await Jimp.read(fileReader.result!);
            if (options.width > 0 && options.height > 0)
              image.scaleToFit({ w: options.width, h: options.height });

            const buffer = await image.getBuffer(options.format);

            const blob = new Blob([buffer], { type: options.format });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;

            const ext = options.format.split("/")[1];
            a.download = `image-converted.${ext}`;

            a.click();
          } catch (error) {
            console.error(error);
          } finally {
            setWait((prev) => prev - 1);
          }
        };

        fileReader.readAsArrayBuffer(file);
      }
    },
    [options.format, options.height, options.width]
  );

  return (
    <ConvertContext.Provider value={{ wait, options, convert, changeOption }}>
      {children}
    </ConvertContext.Provider>
  );
}

export const useConvert = () => useContext(ConvertContext);
