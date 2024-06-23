export default class ScreenRecorder implements IScreenRecorder {
  mediaRecorder: MediaRecorder | null;
  recordedChunks: Blob[];
  currentVideoUrl: string;
  videoElement: HTMLVideoElement | undefined;
  onRecordReady: (blob: Blob) => void;

  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.currentVideoUrl = "";
    this.videoElement = undefined;
    this.onRecordReady = () => {};
  }

  async startRecordingAsync(audio: boolean) {
    const tracks = await this._getMediaTracks(audio);
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

  private async _getMediaTracks(audio: boolean) {
    let tracks = [];

    const videoStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    tracks = [...videoStream.getTracks()];

    if (audio) {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      tracks = [...tracks, ...audioStream.getAudioTracks()];
    }

    return tracks;
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

    this.onRecordReady(blob);
  }
}
