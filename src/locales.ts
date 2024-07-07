const locales: { [key: string]: { [key: string]: string } } = {
  en: {
    language: "en",
    download_mp4: "Download .mp4",
    download_webm: "Download .wbm",
    microphone: "Microphone",
    camera: "Camera",
    converting: "Converting",
    record: "Record",
    pause: "Pause",
    stop: "Stop",
    integrated_camera: "Integrated Camera",
  },
  es: {
    language: "es",
    download_mp4: "Descargar .mp4",
    download_webm: "Descargar .wbm",
    microphone: "Micrófono",
    camera: "Cámara",
    converting: "Convirtiendo",
    record: "Grabar",
    pause: "Pausa",
    stop: "Detener",
    integrated_camera: "Cámara integrada",
  },
  pt: {
    language: "pt",
    download_mp4: "Baixar .mp4",
    download_webm: "Baixar .wbm",
    microphone: "Microfone",
    camera: "Câmera",
    converting: "Convertendo",
    record: "Gravar",
    pause: "Pausar",
    stop: "Parar",
    integrated_camera: "Câmera integrada",
  },
};

export function getLocale() {
  const language: string = navigator.language.split("-")[0];

  return locales[language] || locales.en;
}

export function tLocale(locale: { [key: string]: string }, key: string) {
  return locale[key] || key;
}
