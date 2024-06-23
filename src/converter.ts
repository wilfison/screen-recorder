import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

type onProgressType = (progress: number) => void;

export async function convertToMp4(blob: Blob, onProgress: onProgressType) {
  const ffmpeg = new FFmpeg();

  ffmpeg.on("progress", ({ progress }) => onProgress(progress * 100));

  await ffmpeg.load({
    coreURL: "/ffmpeg-core.js",
    wasmURL: "/ffmpeg-core.wasm",
    workerURL: "/ffmpeg-core.worker.js",
  });

  await ffmpeg.writeFile("recording.webm", await fetchFile(blob));
  await ffmpeg.exec(["-i", "recording.webm", "-vcodec", "copy", "output.mp4"]);

  const fileData = await ffmpeg.readFile("output.mp4");
  const data = new Uint8Array(fileData as ArrayBuffer);

  return new Blob([data.buffer], { type: "video/mp4" });
}
