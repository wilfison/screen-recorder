import ScreenRecorder from "./screen_recorder";

export const STATUSES = {
  inactive: "inactive",
  recording: "recording",
  paused: "paused",
  processing: "processing",
};

export const INITIAL_STATE: AppState = {
  status: STATUSES.inactive,
  screenRecorder: new ScreenRecorder(),
  downloadReady: false,
  processProgress: 0,
  processedVideoUrl: null,
};
