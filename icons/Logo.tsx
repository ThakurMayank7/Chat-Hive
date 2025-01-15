import React from "react";

function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60"
      width="200"
      height="60"
    >
      <polygon points="30,10 50,10 60,25 50,40 30,40 20,25" fill="#FFCC00" />
      <circle cx="45" cy="25" r="7" fill="#0099FF" />
      <circle cx="45" cy="25" r="4" fill="white" />
      <circle cx="55" cy="25" r="7" fill="#0099FF" />
      <circle cx="55" cy="25" r="4" fill="white" />
      <text
        x="70"
        y="30"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fill="#0099FF"
      >
        Chat
      </text>
      <text
        x="130"
        y="30"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fill="#FFCC00"
      >
        Hive
      </text>
    </svg>
  );
}

export default Logo;
