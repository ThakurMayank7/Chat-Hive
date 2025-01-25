export function ThreeDotsSpinner() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
        .spinner {
          animation: spinner-animation 1.05s infinite;
        }
        .spinner:nth-child(1) {
          animation-delay: 0s;
        }
        .spinner:nth-child(2) {
          animation-delay: 0.1s;
        }
        .spinner:nth-child(3) {
          animation-delay: 0.2s;
        }

        @keyframes spinner-animation {
          0%, 57.14% {
            animation-timing-function: cubic-bezier(0.33, .66, .66, 1);
            transform: translate(0);
          }
          28.57% {
            animation-timing-function: cubic-bezier(0.33, 0, .66, .33);
            transform: translateY(-6px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}
      </style>
      <circle className="spinner" cx="4" cy="12" r="3" />
      <circle className="spinner" cx="12" cy="12" r="3" />
      <circle className="spinner" cx="20" cy="12" r="3" />
    </svg>
  );
}

export function LoadingSpinner() {
  return (
    <svg
      width="24"
      height="24"
      stroke="teal"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
        .spinner_V8m1 {
          transform-origin: center;
          animation: spinner_zKoa 2s linear infinite;
        }
        .spinner_V8m1 circle {
          stroke-linecap: round;
          animation: spinner_YpZS 1.5s ease-in-out infinite;
        }
        @keyframes spinner_zKoa {
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spinner_YpZS {
          0% {
            stroke-dasharray: 0 150;
            stroke-dashoffset: 0;
          }
          47.5% {
            stroke-dasharray: 42 150;
            stroke-dashoffset: -16;
          }
          95%, 100% {
            stroke-dasharray: 42 150;
            stroke-dashoffset: -59;
          }
        }
      `}
      </style>
      <g className="spinner_V8m1">
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
      </g>
    </svg>
  );
}
