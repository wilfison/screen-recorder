const locales: { [key: string]: { [key: string]: string } } = {
  en: {
    language: "en",
    download_file: "Download File",
    microphone: "Microphone",
    camera: "Camera",
    record: "Record",
    pause: "Pause",
    stop: "Stop",
    integrated_camera: "Integrated Camera",
    camera_location: "Camera Location",
    top_left: "Top Left",
    top_right: "Top Right",
    bottom_left: "Bottom Left",
    bottom_right: "Bottom Right",
  },
  es: {
    language: "es",
    download_file: "Descargar archivo",
    microphone: "Micrófono",
    camera: "Cámara",
    record: "Grabar",
    pause: "Pausa",
    stop: "Detener",
    integrated_camera: "Cámara integrada",
    camera_location: "Ubicación de la cámara",
    top_left: "Arriba a la izquierda",
    top_right: "Arriba a la derecha",
    bottom_left: "Abajo a la izquierda",
    bottom_right: "Abajo a la derecha",
  },
  pt: {
    language: "pt",
    download_file: "Baixar arquivo",
    microphone: "Microfone",
    camera: "Câmera",
    record: "Gravar",
    pause: "Pausar",
    stop: "Parar",
    integrated_camera: "Câmera integrada",
    camera_location: "Localização da câmera",
    top_left: "Superior esquerdo",
    top_right: "Superior direito",
    bottom_left: "Inferior esquerdo",
    bottom_right: "Inferior direito",
  },
};

export function getLocale() {
  const language: string = navigator.language.split("-")[0];

  return locales[language] || locales.en;
}

export function tLocale(locale: { [key: string]: string }, key: string) {
  return locale[key] || key;
}
