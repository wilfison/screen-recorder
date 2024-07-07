import React from "react";
import icons from "./icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: keyof typeof icons;
  title: string;
}

export default function Button({ icon, title, ...otherProps }: ButtonProps) {
  const IconComponent = icons[icon];

  return (
    <button className={`action-btn ${icon}`} {...otherProps} title={title}>
      <IconComponent size={16} className="icon" />
    </button>
  );
}
