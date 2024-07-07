import ScreenRecorder from "./screen_recorder";
import { getLocale } from "./locales";

export const STATUSES = {
  inactive: "inactive",
  recording: "recording",
  paused: "paused",
  processing: "processing",
};

export const INITIAL_STATE: AppState = {
  locale: getLocale(),
  status: STATUSES.inactive,
  screenRecorder: new ScreenRecorder(),
  downloadReady: false,
  processProgress: 0,
  processedVideoUrl: null,
  includeAudio: true,
  includeCamera: false,
  audioInputs: [],
  videoInputs: [],
  audioInputId: "default",
  videoInputId: "",
  cameraLocation: "top_left",
};
