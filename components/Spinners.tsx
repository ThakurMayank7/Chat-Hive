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
