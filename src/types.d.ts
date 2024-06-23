interface IScreenRecorder {
  onRecordReady: (blob: Blob) => void;
  videoElement: HTMLVideoElement | undefined;
  startRecordingAsync: (audio: boolean) => Promise<void>;
  pauseResumeRecording: () => void;
  stopRecording: () => void;
}

type AppState = {
  locale: LocaleType;
  status: string;
  screenRecorder: ScreenRecorder;
  downloadReady: boolean;
  processProgress: number;
  processedVideoUrl: string | null;
  includeAudio: boolean;
};

type LocaleType = {
  [key: string]: string;
};
