interface IScreenRecorder {
  onRecordReady: (blob: Blob) => void;
  videoElement: HTMLVideoElement | undefined;
  startRecordingAsync: (audio: boolean, video: boolean) => Promise<void>;
  pauseResumeRecording: () => void;
  stopRecording: () => void;
  getAudioInputs: () => Promise<deviceType[]>;
  getVideoInputs: () => Promise<deviceType[]>;
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
  includeCamera: boolean;
  audioInputs: deviceType[];
  videoInputs: deviceType[];
  audioInputId: string;
  videoInputId: string;
  cameraLocation: string;
};

type LocaleType = {
  [key: string]: string;
};
