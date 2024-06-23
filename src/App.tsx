import { useEffect, useRef, useState } from "react";

import { convertToMp4 } from "./converter";
import { STATUSES, INITIAL_STATE } from "./data";

import Button from "./components/button";
import appIcon from "./assets/icon.svg";

function App() {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = (newState: Partial<AppState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const onStartRecording = async () => {
    await state.screenRecorder.startRecordingAsync();

    updateState({ status: STATUSES.recording });
  };

  const onPauseResumeRecording = () => {
    state.screenRecorder.pauseResumeRecording();
    const mediaRecorderState = state.screenRecorder.mediaRecorder?.state;

    updateState({
      status:
        mediaRecorderState === "recording"
          ? STATUSES.recording
          : STATUSES.paused,
    });
  };

  const onStopRecording = () => {
    state.screenRecorder.stopRecording();

    updateState({ status: STATUSES.processing });
  };

  const onDownload = (format: string) => {
    const videoUrl =
      format === "webm"
        ? state.screenRecorder.currentVideoUrl
        : state.processedVideoUrl;

    if (!videoUrl) {
      return;
    }

    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `recording.${format}`;
    a.click();

    updateState({ status: STATUSES.inactive });
  };

  const onRecordReady = async (blob: Blob) => {
    updateState({
      processProgress: 0,
      downloadReady: true,
      status: STATUSES.processing,
      processedVideoUrl: null,
    });

    URL.revokeObjectURL(String(state.processedVideoUrl));
    const mp4Blob = await convertToMp4(blob, onProgress);

    updateState({
      processedVideoUrl: URL.createObjectURL(mp4Blob),
      status: STATUSES.inactive,
      processProgress: 100,
    });
  };

  const onProgress = (progress: number) => {
    updateState({ processProgress: progress });
  };

  useEffect(() => {
    state.screenRecorder.onRecordReady = onRecordReady;

    if (video.current) {
      state.screenRecorder.videoElement = video.current;
    }
  });

  return (
    <>
      <div className="main-container">
        <div className="row brand">
          <img src={appIcon} alt="icon" />
          <h1>ScreenRecorder</h1>
        </div>

        <div className="row video-container">
          <video ref={video} autoPlay playsInline controls></video>
        </div>

        <div className="row">
          <Button
            icon="download"
            text="Download .mp4"
            onClick={() => onDownload("mp4")}
            disabled={!state.downloadReady || !state.processedVideoUrl}
          />
          <Button
            icon="download"
            text="Download .webm"
            onClick={() => onDownload("webm")}
            disabled={!state.downloadReady}
          />
        </div>

        <div className="row">
          <input
            type="checkbox"
            id="include-audio"
            checked={state.includeAudio}
            onChange={(e) => updateState({ includeAudio: e.target.checked })}
          />
          <label htmlFor="include-audio">Include audio</label>
        </div>

        <div className="row progress-container">
          <div
            className="progress-bar"
            style={{ display: state.processProgress > 0 ? "block" : "none" }}
          >
            <div
              className="progress"
              style={{ width: `${state.processProgress}%` }}
            ></div>
          </div>
          <div
            className="progress-description"
            style={{ display: state.processProgress > 0 ? "block" : "none" }}
          >
            Convertendo: {state.processProgress}%
          </div>
        </div>
      </div>

      <div className="controls">
        <Button
          icon="record"
          text="Record"
          onClick={onStartRecording}
          disabled={state.status !== STATUSES.inactive}
        />

        <Button
          icon="pause"
          text={state.status === STATUSES.paused ? "Resume" : "Pause"}
          onClick={onPauseResumeRecording}
          disabled={
            ![STATUSES.recording, STATUSES.paused].includes(state.status)
          }
        />

        <Button
          icon="stop"
          text="Stop"
          onClick={onStopRecording}
          disabled={[STATUSES.inactive, STATUSES.processing].includes(
            state.status
          )}
        />
      </div>
    </>
  );
}

export default App;
