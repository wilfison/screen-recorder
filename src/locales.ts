const locales: { [key: string]: { [key: string]: string } } = {
  en: {
    language: "en",
    download_mp4: "Download .mp4",
    download_webm: "Download .wbm",
    include_audio: "Include audio",
    converting: "Converting",
    record: "Record",
    pause: "Pause",
    stop: "Stop",
  },
  es: {
    language: "es",
    download_mp4: "Descargar .mp4",
    download_webm: "Descargar .wbm",
    include_audio: "Incluir audio",
    converting: "Convirtiendo",
    record: "Grabar",
    pause: "Pausa",
    stop: "Detener",
  },
  pt: {
    language: "pt",
    download_mp4: "Baixar .mp4",
    download_webm: "Baixar .wbm",
    include_audio: "Incluir áudio",
    converting: "Convertendo",
    record: "Gravar",
    pause: "Pausar",
    stop: "Parar",
  },
};

export function getLocale() {
  const language: string = navigator.language.split("-")[0];

  return locales[language] || locales.en;
}

export function tLocale(locale: { [key: string]: string }, key: string) {
  return locale[key] || key;
}
