import type * as types from 'types';

const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;
const THRESHOLD = 128;

async function generate(file: File, options: { width: number; height: number }) {
  const bitmap = await createImageBitmap(file);

  const scale = Math.max(options.width / bitmap.width, options.height / bitmap.height);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(bitmap, 0, 0, w, h);

  const offsetX = Math.round((w - options.width) / 2);
  const offsetY = Math.round((h - options.height) / 2);

  const data = ctx.getImageData(offsetX, offsetY, options.width, options.height).data;
  const grid: types.Cell[][] = [];

  for (let y = 0; y < options.height; y++) {
    const row: types.Cell[] = [];
    for (let x = 0; x < options.width; x++) {
      const i = (y * options.width + x) * 4;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = LUMA_R * r + LUMA_G * g + LUMA_B * b;
      const value = luminance > THRESHOLD ? 1 : 0;

      const error = luminance - value * 255;
      if (x < options.width - 1) {
        data[i + 4] += (error * 7) / 16;
      }
      if (y < options.height - 1) {
        if (x > 0) data[i + options.width * 4 - 4] += (error * 3) / 16;
        data[i + options.width * 4] += (error * 5) / 16;
        if (x < options.width - 1) data[i + options.width * 4 + 4] += (error * 1) / 16;
      }

      row.push([value]);
    }
    grid.push(row);
  }

  // TODO: auto fill

  bitmap.close();
  return grid;
}

self.onmessage = async (e) => {
  try {
    const { file, options } = e.data;
    self.postMessage({ status: 'success', data: await generate(file, options) });
  } catch (error) {
    self.postMessage({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export type {};
