import { useEffect, useRef, useState } from "react";

import { convertToMp4 } from "./converter";
import { STATUSES, INITIAL_STATE } from "./data";
import { tLocale } from "./locales";

import Button from "./components/button";
import appIcon from "./assets/icon.svg";
import Control from "./components/control";
import icons from "./components/icons";

function App() {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState(INITIAL_STATE);

  const updateState = (newState: Partial<AppState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const startApp = async () => {
    state.screenRecorder.onRecordReady = onRecordReady;

    if (video.current) {
      state.screenRecorder.videoElement = video.current;
    }

    const audioInputs = await state.screenRecorder.getAudioInputs();

    updateState({ audioInputs });
  };

  const onStartRecording = async () => {
    await state.screenRecorder.startRecordingAsync(
      state.includeAudio,
      state.audioInputId
    );

    updateState({ status: STATUSES.recording, processProgress: 0 });
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

  const t = (key: string) => tLocale(state.locale, key);

  useEffect(() => {
    startApp();
  });

  return (
    <div className="app">
      <div className="brand">
        <img src={appIcon} alt="icon" />
        <h1 className="brand-name">ScreenRecorder</h1>
      </div>

      <div className="row main-content">
        <div className="video-container">
          <video ref={video} autoPlay playsInline controls></video>
        </div>

        <div className="devices">
          <Control
            label={t("include_audio")}
            icon={state.includeAudio ? icons.microphone : icons.microphoneSlash}
            active={state.includeAudio}
            onChangeCheck={(checked) => updateState({ includeAudio: checked })}
            onSelectionChange={(value) => updateState({ audioInputId: value })}
            selectionList={state.audioInputs}
          />
        </div>

        <div className="actions">
          <Button
            icon="pause"
            title={state.status === STATUSES.paused ? t("record") : t("pause")}
            onClick={onPauseResumeRecording}
            disabled={
              ![STATUSES.recording, STATUSES.paused].includes(state.status)
            }
          />

          <Button
            icon="record"
            title={t("record")}
            onClick={onStartRecording}
            disabled={state.status !== STATUSES.inactive}
          />

          <Button
            icon="stop"
            title={t("stop")}
            onClick={onStopRecording}
            disabled={[STATUSES.inactive, STATUSES.processing].includes(
              state.status
            )}
          />
        </div>
      </div>

      <div className="row">
        <div className="download-container">
          <Button
            icon="download"
            title={t("download_mp4")}
            onClick={() => onDownload("mp4")}
            disabled={!state.downloadReady || !state.processedVideoUrl}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
