import { useEffect, useRef, useState } from "react";

import { convertToMp4 } from "./converter";

import ScreenRecorder from "./screen_recorder";
import Button from "./components/button";

import appIcon from "./assets/icon.svg";

const STATUSES = {
  inactive: "inactive",
  recording: "recording",
  paused: "paused",
  processing: "processing",
};

function App() {
  const video = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState(STATUSES.inactive);
  const [screenRecorder] = useState<ScreenRecorder>(new ScreenRecorder());
  const [downloadReady, setDownloadReady] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null
  );

  const onStartRecording = async () => {
    await screenRecorder.startRecordingAsync();
    setStatus(STATUSES.recording);
  };

  const onPauseResumeRecording = () => {
    screenRecorder.pauseResumeRecording();
    setStatus(
      screenRecorder.mediaRecorder?.state === "recording"
        ? STATUSES.recording
        : STATUSES.paused
    );
  };

  const onStopRecording = () => {
    screenRecorder.stopRecording();
    setStatus(STATUSES.processing);
  };

  const onDownload = (format: string) => {
    const videoUrl =
      format === "webm" ? screenRecorder.currentVideoUrl : processedVideoUrl;

    if (!videoUrl) {
      return;
    }

    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `recording.${format}`;
    a.click();

    setStatus(STATUSES.inactive);
  };

  const onRecordReady = async (blob: Blob) => {
    setProcessProgress(0);
    setDownloadReady(true);
    setStatus(STATUSES.processing);
    setProcessedVideoUrl(null);

    URL.revokeObjectURL(String(processedVideoUrl));
    const mp4Blob = await convertToMp4(blob, setProcessProgress);

    setProcessedVideoUrl(URL.createObjectURL(mp4Blob));

    setStatus(STATUSES.inactive);
    setProcessProgress(0);
  };

  useEffect(() => {
    screenRecorder.onRecordReady = onRecordReady;

    if (video.current) {
      screenRecorder.videoElement = video.current;
    }
  });

  return (
    <>
      <div className="main-container">
        <div className="brand">
          <img src={appIcon} alt="icon" />
          <h1>ScreenRecorder</h1>
        </div>

        <div className="video-container">
          <video ref={video} autoPlay playsInline controls></video>
        </div>

        <div className="row">
          <Button
            icon="download"
            text="Download .mp4"
            onClick={() => onDownload("mp4")}
            disabled={!downloadReady || !processedVideoUrl}
          />
          <Button
            icon="download"
            text="Download .webm"
            onClick={() => onDownload("webm")}
            disabled={!downloadReady}
          />
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ display: processProgress > 0 ? "block" : "none" }}
          >
            <div
              className="progress"
              style={{ width: `${processProgress}%` }}
            ></div>
          </div>
          <div
            className="progress-description"
            style={{ display: processProgress > 0 ? "block" : "none" }}
          >
            Convertendo: {processProgress}%
          </div>
        </div>
      </div>

      <div className="controls">
        <Button
          icon="record"
          text="Record"
          onClick={onStartRecording}
          disabled={status !== STATUSES.inactive}
        />

        <Button
          icon="pause"
          text={status === STATUSES.paused ? "Resume" : "Pause"}
          onClick={onPauseResumeRecording}
          disabled={![STATUSES.recording, STATUSES.paused].includes(status)}
        />

        <Button
          icon="stop"
          text="Stop"
          onClick={onStopRecording}
          disabled={[STATUSES.inactive, STATUSES.processing].includes(status)}
        />
      </div>
    </>
  );
}

export default App;
