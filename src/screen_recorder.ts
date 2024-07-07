export default class ScreenRecorder implements IScreenRecorder {
  mediaRecorder: MediaRecorder | null;
  recordedChunks: Blob[];
  currentVideoUrl: string;
  audioInputId: string;
  videoInputId: string;
  videoElement: HTMLVideoElement | undefined;
  onRecordReady: (blob: Blob) => void;

  private _screenVideo: HTMLVideoElement;
  private _webcamVideo: HTMLVideoElement;
  private _canvas: HTMLCanvasElement;
  private _canvasContext: CanvasRenderingContext2D | null;
  private _screenTrack: MediaStreamTrack | null;

  WEBCAM_WIDTH = 300;
  WEBCAM_HEIGHT = 225;

  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.currentVideoUrl = "";
    this.audioInputId = "default";
    this.videoInputId = "";
    this.videoElement = undefined;
    this.onRecordReady = () => {};

    this._screenVideo = document.createElement("video");
    this._webcamVideo = document.createElement("video");
    this._canvas = document.createElement("canvas");
    this._canvasContext = this._canvas.getContext("2d");
    this._screenTrack = null;
  }

  async startRecordingAsync(audio: boolean, video: boolean) {
    const tracks = await this._getMediaTracks(audio, video);
    const stream = new MediaStream(tracks);

    this._setVideoSrc(stream, 0);

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=h264",
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = this._onStopRecording.bind(this);

    this.mediaRecorder.start();
  }

  pauseResumeRecording() {
    if (!this.mediaRecorder) {
      return;
    }

    if (this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
    } else if (this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
    }
  }

  stopRecording() {
    if (!this.mediaRecorder) {
      return;
    }

    this.mediaRecorder.stop();
    this._setVideoSrc(null, 0);

    this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  }

  async getAudioInputs(): Promise<deviceType[]> {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      return devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => ({ label: device.label, value: device.deviceId }));
    });
  }

  async getVideoInputs(): Promise<deviceType[]> {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      return devices
        .filter((device) => device.kind === "videoinput")
        .map((device) => ({ label: device.label, value: device.deviceId }));
    });
  }

  private async _getMediaTracks(audio: boolean, video: boolean) {
    const screenConfig: MediaStreamConstraints = { video: true };
    const webcamConfig: MediaStreamConstraints = { audio, video };

    if (audio && !!this.audioInputId) {
      webcamConfig.audio = { deviceId: { exact: this.audioInputId } };
    }

    if (video && !!this.videoInputId) {
      webcamConfig.video = { deviceId: { exact: this.videoInputId } };
    }

    const webcamStream = await navigator.mediaDevices.getUserMedia(
      webcamConfig
    );
    const screenStream = await navigator.mediaDevices.getDisplayMedia(
      screenConfig
    );

    // Stop recording when screen sharing ends
    this._screenTrack = screenStream.getVideoTracks()[0];
    this._screenTrack.onended = () => {
      if (this.mediaRecorder?.state === "recording") {
        this.mediaRecorder.stop();
      }
    };

    this._screenVideo.srcObject = screenStream;
    this._screenVideo.play();

    this._webcamVideo.srcObject = webcamStream;
    this._webcamVideo.muted = true;
    this._webcamVideo.play();

    this._screenVideo.onloadedmetadata = () => {
      this._canvas.width = this._screenVideo.videoWidth;
      this._canvas.height = this._screenVideo.videoHeight;
    };

    this._canvasContext = this._canvas.getContext("2d");

    this._drawFrame();
    const canvasStream = this._canvas.captureStream(30);

    return [...canvasStream.getVideoTracks(), ...webcamStream.getAudioTracks()];
  }

  private _setVideoSrc(src: MediaStream | string | null, volume: number) {
    if (!this.videoElement) {
      return;
    }

    if (typeof src === "string") {
      this.videoElement.srcObject = null;
      this.videoElement.src = src;
    } else if (src instanceof MediaStream) {
      this.videoElement.src = "";
      this.videoElement.srcObject = src;
    } else {
      this.videoElement.src = "";
      this.videoElement.srcObject = null;
    }

    this.videoElement.volume = volume;
  }

  private async _onStopRecording() {
    const blob = new Blob(this.recordedChunks, {
      type: "video/webm;codecs=h264",
    });

    window.URL.revokeObjectURL(this.currentVideoUrl);
    this.currentVideoUrl = URL.createObjectURL(blob);

    this._setVideoSrc(this.currentVideoUrl, 1);
    this.recordedChunks = [];

    this._screenVideo.srcObject = null;
    this._webcamVideo.srcObject = null;

    if (this._screenTrack?.readyState === "live") {
      this._screenTrack.stop();
    }

    this.onRecordReady(blob);
  }

  private _drawFrame() {
    this._canvasContext?.drawImage(
      this._screenVideo,
      0,
      0,
      this._canvas.width,
      this._canvas.height
    );

    this._canvasContext?.drawImage(
      this._webcamVideo,
      this._canvas.width - this.WEBCAM_WIDTH - 50,
      this._canvas.height - this.WEBCAM_HEIGHT - 50,
      this.WEBCAM_WIDTH,
      this.WEBCAM_HEIGHT
    );

    requestAnimationFrame(this._drawFrame.bind(this));
  }
}
