import { useEffect, useRef, useState } from "react";
import appIcon from "./assets/icon.svg";

import ScreenRecorder from "./screen_recorder";
import Button from "./components/button";

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
    setStatus(STATUSES.inactive);
  };

  const onDownload = () => {
    const a = document.createElement("a");
    a.href = screenRecorder.currentVideoUrl;
    a.download = "recording.webm";
    a.click();

    setStatus(STATUSES.inactive);
  };

  useEffect(() => {
    screenRecorder.onRecordReady = () => setDownloadReady(true);

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

        <div id="download">
          <Button
            icon="download"
            text="Download"
            onClick={onDownload}
            disabled={!downloadReady}
          />
        </div>
      </div>

      <div className="controls">
        <Button
          icon="play"
          text="Start"
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
