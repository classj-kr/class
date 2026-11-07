import createEncoder from './vendor/webp/codec/enc/webp_enc.js';
import { defaultOptions } from './vendor/webp/meta.js';

self.onmessage = async ({ data: { width, height, data } }) => {
  try {
    const encoder = await createEncoder({ locateFile: name => new URL(`./vendor/webp/codec/enc/${name}`, import.meta.url).href });
    const result = encoder.encode(new Uint8ClampedArray(data), width, height, {
      ...defaultOptions, lossless: 1, exact: 1, quality: 100, near_lossless: 100, method: 4,
    });
    if (!result) throw Error('그림을 변환하지 못했어요. 다시 시도해 주세요.');
    const buffer = result.slice().buffer;
    self.postMessage({ buffer }, [buffer]);
  } catch (error) { self.postMessage({ error: error.message }); }
};
