import React from "react";
import icons from "./icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: keyof typeof icons;
  text: string;
}

export default function Button({ icon, text, ...otherProps }: ButtonProps) {
  return (
    <button className={`btn ${icon}`} {...otherProps}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d={icons[icon]}></path>
      </svg>
      {text}
    </button>
  );
}
