import {
  Icon,
  Download,
  Pause,
  Record,
  Stop,
  Microphone,
  MicrophoneSlash,
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
};

export default icons;
