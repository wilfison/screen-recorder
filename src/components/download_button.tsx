import React from "react";
import icons from "./icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  progress: number;
}

export default function DownloadButton({
  title,
  progress,
  ...otherProps
}: ButtonProps) {
  const IconComponent = icons.download;

  return (
    <button className="download-btn" {...otherProps} title={title}>
      <div className="progress" style={{ width: `${progress}%` }}></div>

      <div className="content">
        <IconComponent size={16} className="icon" />
        {title}
      </div>
    </button>
  );
}
