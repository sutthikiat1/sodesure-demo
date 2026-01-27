import logo from "../../assets/logo.png";

const Loading = () => {
  return (
    <>
      <style>
        {`
          @keyframes pulse-ring {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }

          @keyframes pulse-ring-delay {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }

          @keyframes scan-line {
            0% {
              top: 0%;
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              top: 100%;
              opacity: 1;
            }
          }

          @keyframes logo-pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.9;
            }
          }

          @keyframes dot-bounce {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          .loading-ring {
            animation: pulse-ring 1.5s ease-out infinite;
          }

          .loading-ring-delay {
            animation: pulse-ring-delay 1.5s ease-out infinite;
            animation-delay: 0.3s;
          }

          .loading-ring-delay-2 {
            animation: pulse-ring-delay 1.5s ease-out infinite;
            animation-delay: 0.6s;
          }

          .scan-line-anim {
            animation: scan-line 2s ease-in-out infinite;
          }

          .logo-pulse-anim {
            animation: logo-pulse 2s ease-in-out infinite;
          }

          .dot-bounce-1 {
            animation: dot-bounce 1.4s ease-in-out infinite;
          }

          .dot-bounce-2 {
            animation: dot-bounce 1.4s ease-in-out infinite;
            animation-delay: 0.2s;
          }

          .dot-bounce-3 {
            animation: dot-bounce 1.4s ease-in-out infinite;
            animation-delay: 0.4s;
          }

          .shimmer-text {
            background: linear-gradient(
              90deg,
              #2F7A59 0%,
              #4ade80 50%,
              #2F7A59 100%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 2s linear infinite;
          }
        `}
      </style>

      <div className="flex flex-col items-center justify-center gap-6">
        {/* Logo with pulsing rings */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing rings */}
          <div className="absolute w-32 h-32 rounded-full border-2 border-primary/30 loading-ring" />
          <div className="absolute w-32 h-32 rounded-full border-2 border-primary/20 loading-ring-delay" />
          <div className="absolute w-32 h-32 rounded-full border border-primary/10 loading-ring-delay-2" />

          {/* Logo container with scan effect */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-lg">
            {/* Logo */}
            <img
              src={logo}
              alt="SOD Sure Logo"
              className="w-full h-full object-contain p-2 logo-pulse-anim"
            />

            {/* Scanning line */}
            <div
              className="absolute left-0 w-full h-1 scan-line-anim"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(47, 122, 89, 0.6), transparent)",
                boxShadow: "0 0 10px rgba(47, 122, 89, 0.5)",
              }}
            />
          </div>
        </div>

        {/* Loading text with bouncing dots */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium shimmer-text">
            กำลังวิเคราะห์
          </p>

          {/* Bouncing dots */}
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-primary rounded-full dot-bounce-1" />
            <div className="w-2 h-2 bg-primary rounded-full dot-bounce-2" />
            <div className="w-2 h-2 bg-primary rounded-full dot-bounce-3" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 text-center">
          AI กำลังตรวจสอบความสดของเนื้อ
        </p>
      </div>
    </>
  );
};

export default Loading;
