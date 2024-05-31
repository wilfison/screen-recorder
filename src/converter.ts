import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function convertToMp4(blob: Blob, onProgress: (progress: number) => void) {
  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
  const ffmpeg = new FFmpeg();

  ffmpeg.on('progress', ({ progress }) => onProgress(progress * 100));

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.wasm`,
      "application/wasm"
    ),
    workerURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      "text/javascript"
    ),
  });

  await ffmpeg.writeFile('recording.webm', await fetchFile(blob));
  await ffmpeg.exec(['-i', 'recording.webm', '-vcodec', 'copy', 'output.mp4']);

  const fileData = await ffmpeg.readFile('output.mp4');
  const data = new Uint8Array(fileData as ArrayBuffer);

  return new Blob([data.buffer], { type: 'video/mp4' });
}
