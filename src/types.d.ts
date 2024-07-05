interface IScreenRecorder {
  onRecordReady: (blob: Blob) => void;
  videoElement: HTMLVideoElement | undefined;
  startRecordingAsync: (audio: boolean, audioInputId: string) => Promise<void>;
  pauseResumeRecording: () => void;
  stopRecording: () => void;
  getAudioInputs: () => Promise<deviceType[]>;
}

type deviceType = {
  label: string;
  value: string;
};

type AppState = {
  locale: LocaleType;
  status: string;
  screenRecorder: ScreenRecorder;
  downloadReady: boolean;
  processProgress: number;
  processedVideoUrl: string | null;
  includeAudio: boolean;
  audioInputs: deviceType[];
  audioInputId: string;
};

type LocaleType = {
  [key: string]: string;
};
