import {
  Icon,
  Download,
  Pause,
  Record,
  Stop,
  Microphone,
  MicrophoneSlash,
  Webcam,
  WebcamSlash,
} from "@phosphor-icons/react";

type IconType = {
  [key: string]: Icon;
};

const icons: IconType = {
  download: Download,
  record: Record,
  pause: Pause,
  stop: Stop,
  microphone: Microphone,
  microphoneSlash: MicrophoneSlash,
  webcam: Webcam,
  webcamSlash: WebcamSlash,
};

export default icons;
