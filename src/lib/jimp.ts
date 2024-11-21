import { createJimp } from "@jimp/core";
import { defaultFormats, defaultPlugins, JimpMime } from "jimp";
import jpeg from "@jimp/wasm-jpeg";
import png from "@jimp/wasm-png";
import webp from "@jimp/wasm-webp";
// import avif from "@jimp/wasm-avif";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import avif from "https://cdn.jsdelivr.net/npm/@jimp/wasm-avif@1.6.0/+esm";

export const Jimp = createJimp({
  formats: [...defaultFormats, jpeg, png, webp, avif],
  plugins: defaultPlugins,
});

export const JIMP_MIME = {
  ...JimpMime,
  avif: avif().mime as "image/avif",
  jpeg: jpeg().mime,
  png: png().mime,
  webp: webp().mime,
} as const;

export const JIMP_MIME_KEYS = Object.keys(JIMP_MIME);
export type JimpMimeKeys = keyof typeof JIMP_MIME;

export const JIMP_MIME_VALUES = Object.values(JIMP_MIME);
export type JimpMimeValues = (typeof JIMP_MIME)[JimpMimeKeys];
