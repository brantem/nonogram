import type * as types from 'types';
import type { Options } from './types';

const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;

async function generate(file: File, width: number, height: number, options: Options) {
  const { threshold = 128, fit = 'cover', invert = false, smoothness = 0 } = options;

  const bitmap = await createImageBitmap(file);

  let scale = 1;
  switch (fit) {
    case 'cover':
      scale = Math.max(width / bitmap.width, height / bitmap.height);
      break;
    case 'contain':
      scale = Math.min(width / bitmap.width, height / bitmap.height);
      break;
  }

  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false; // disable smoothing for pixelation

  ctx.drawImage(bitmap, 0, 0, w, h);

  // calculate cropping offsets for 'cover' behavior
  let offsetX = 0;
  let offsetY = 0;
  if (fit === 'cover') {
    offsetX = Math.round((w - width) / 2);
    offsetY = Math.round((h - height) / 2);
  }

  // get image data for the target area
  const data = ctx.getImageData(offsetX, offsetY, width, height).data;
  const grid: types.Cell[][] = [];

  // apply noise reduction (simple averaging filter)
  if (smoothness > 0) {
    const radius = smoothness;
    const tempData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        let count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const i = (ny * width + nx) * 4;
              rSum += data[i];
              gSum += data[i + 1];
              bSum += data[i + 2];
              count++;
            }
          }
        }

        const i = (y * width + x) * 4;
        tempData[i] = rSum / count;
        tempData[i + 1] = gSum / count;
        tempData[i + 2] = bSum / count;
        tempData[i + 3] = data[i + 3]; // preserve alpha
      }
    }

    // replace original data with noise-reduced data
    for (let i = 0; i < data.length; i++) data[i] = tempData[i];
  }

  // generate the grid
  for (let y = 0; y < height; y++) {
    const row: types.Cell[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      // calculate luminance
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = LUMA_R * r + LUMA_G * g + LUMA_B * b;

      // apply threshold and inversion
      let value: types.Cell[0] = luminance > threshold ? 1 : 0;
      if (invert) value = value === 1 ? 0 : 1;

      row.push([value]);
    }
    grid.push(row);
  }

  bitmap.close();
  return grid;
}

self.onmessage = async (e) => {
  try {
    const { file, width, height, options } = e.data;
    self.postMessage({ status: 'success', data: await generate(file, width, height, options) });
  } catch (error) {
    self.postMessage({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export type {};
