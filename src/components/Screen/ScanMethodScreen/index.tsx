import {
  Camera,
  BadgeAlert,
  BadgeX,
  BadgeCheck,
  Store,
  ImagePlus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useAppContext } from "../../../AppContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../Layout/Loading";

// Animation styles for result state and upload state
const animationStyles = `
  /* ===== Upload State Animations ===== */
  @keyframes float-scan {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse-ring-scan {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1.6);
      opacity: 0;
    }
  }

  @keyframes pulse-ring-scan-delay {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.8);
      opacity: 0;
    }
  }

  @keyframes shimmer-btn {
    0% {
      background-position: -200% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  @keyframes sparkle-scan {
    0%, 100% {
      opacity: 0;
      transform: scale(0) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1) rotate(180deg);
    }
  }

  @keyframes bounce-btn {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  @keyframes rotate-bg {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .scan-float {
    animation: float-scan 3s ease-in-out infinite;
  }

  .scan-pulse-ring {
    animation: pulse-ring-scan 2s ease-out infinite;
  }

  .scan-pulse-ring-delay {
    animation: pulse-ring-scan-delay 2s ease-out infinite;
    animation-delay: 0.5s;
  }

  .scan-shimmer-btn {
    background: linear-gradient(
      90deg,
      #2F7A59 0%,
      #3d9970 25%,
      #2F7A59 50%,
      #3d9970 75%,
      #2F7A59 100%
    );
    background-size: 200% auto;
    animation: shimmer-btn 3s linear infinite;
  }

  .scan-sparkle-1 {
    animation: sparkle-scan 2s ease-in-out infinite;
  }

  .scan-sparkle-2 {
    animation: sparkle-scan 2s ease-in-out infinite;
    animation-delay: 0.7s;
  }

  .scan-sparkle-3 {
    animation: sparkle-scan 2s ease-in-out infinite;
    animation-delay: 1.4s;
  }

  .scan-bounce-btn {
    animation: bounce-btn 2s ease-in-out infinite;
  }

  .scan-rotate-bg {
    animation: rotate-bg 20s linear infinite;
  }

`;

function ScanMethodScreen() {
  const {
    fileInputRef,
    handleFileUpload,
    scanResult,
    isScanLoading,
    selectedImage,
    resetStateScan,
  } = useAppContext();

  const navigate = useNavigate();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const bgColorFromPredictClass = (intense?: boolean) => {
    if (scanResult?.predicted_class === "fresh") {
      return intense ? "bg-primary" : "bg-gradient-to-b from-green-50 to-white";
    } else if (scanResult?.predicted_class === "rotten") {
      return intense ? "bg-amber-500" : "bg-gradient-to-b from-amber-50 to-white";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return intense ? "bg-red-500" : "bg-gradient-to-b from-red-50 to-white";
    } else {
      return "bg-white";
    }
  };

  const textColorFromPredictClass = () => {
    if (scanResult?.predicted_class === "fresh") {
      return "text-primary";
    } else if (scanResult?.predicted_class === "rotten") {
      return "text-amber-600";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return "text-red-600";
    } else {
      return "text-gray-600";
    }
  };

  const getIconFromPredictClass = () => {
    if (scanResult?.predicted_class === "fresh") {
      return <BadgeCheck className="w-5 h-5 text-white" />;
    } else if (scanResult?.predicted_class === "rotten") {
      return <BadgeAlert className="w-5 h-5 text-white" />;
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return <BadgeX className="w-5 h-5 text-white" />;
    }
  };

  const getTextFromPredictClass = (isBadge?: boolean) => {
    if (scanResult?.predicted_class === "fresh") {
      return "สด";
    } else if (scanResult?.predicted_class === "rotten") {
      return "เสี่ยง";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return isBadge ? "ไม่ใช่เนื้อสัตว์" : "ไม่ถูกต้อง (ไม่ใช่เนื้อสัตว์)";
    } else {
      return "";
    }
  };

  const getTextColorPercent = () => {
    if (scanResult?.confidence) {
      if (scanResult?.confidence >= 0.8) {
        return "text-green-600";
      } else if (scanResult.confidence >= 0.5) {
        return "text-amber-600";
      } else if (scanResult.confidence < 0.5) {
        return "text-red-600";
      }
    }
  };

  const getBgColorPercent = () => {
    if (scanResult?.confidence) {
      if (scanResult?.confidence >= 0.8) {
        return "bg-gradient-to-r from-green-500 to-green-400";
      } else if (scanResult.confidence >= 0.4) {
        return "bg-gradient-to-r from-amber-500 to-amber-400";
      } else if (scanResult.confidence < 0.4) {
        return "bg-gradient-to-r from-red-500 to-red-400";
      }
    }
  };

  const getDescriptionFromPredictClass = () => {
    if (scanResult?.predicted_class === "fresh") {
      return "เหมาะสำหรับการปรุงอาหารและบริโภค";
    } else if (scanResult?.predicted_class === "rotten") {
      return "ควรหลีกเลี่ยงการบริโภคเนื้อสัตว์นี้";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return "โปรดอัปโหลดภาพเนื้อสัตว์ที่ถูกต้อง";
    }
  };

  useEffect(() => {
    resetStateScan();
  }, []);

  return (
    <>
      <style>{animationStyles}</style>
      <div className={`p-4 min-h-dvh mt-18 pb-24 ${bgColorFromPredictClass()}`}>
        {/* ========== RESULT STATE ========== */}
        {!isScanLoading && scanResult && (
          <div className="flex flex-col gap-5 animate-fade-in">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                ผลการประเมิน
              </h1>
              <p className={`text-2xl font-bold ${textColorFromPredictClass()}`}>
                {getTextFromPredictClass()}
              </p>
            </div>

            {/* Image with badge */}
            <div className="relative">
              {/* Image container */}
              <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-lg bg-gray-100 border border-gray-200">
                <img
                  alt="scan-result"
                  src={selectedImage as string}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status Badge */}
              <div
                className={`absolute -bottom-4 left-1/2 -translate-x-1/2 ${bgColorFromPredictClass(
                  true
                )} rounded-full px-5 py-2 shadow-lg border-4 border-white`}
              >
                <span className="text-white text-base font-semibold inline-flex items-center gap-2">
                  <span className="inline-flex">
                    {getIconFromPredictClass()}
                  </span>
                  {getTextFromPredictClass(true)}
                </span>
              </div>
            </div>

            {/* Result Card */}
            <div className="bg-white rounded-3xl shadow-md p-5 mt-2">
              {/* Confidence */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm">
                    ระดับความเชื่อมั่น (AI Confidence)
                  </span>
                  <span className={`font-bold text-lg ${getTextColorPercent()}`}>
                    {scanResult
                      ? (scanResult.confidence * 100).toFixed(0) + "%"
                      : "N/A"}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="relative w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`absolute ${getBgColorPercent()} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${(scanResult?.confidence ?? 0) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gray-100 my-4" />

              {/* Description */}
              <p className="text-center text-gray-700">
                {getDescriptionFromPredictClass()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={resetStateScan}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5" />
                <span>สแกนอีกครั้ง</span>
              </button>

              {scanResult?.predicted_class !== "fresh" && (
                <button
                  onClick={() => navigate("/nearby")}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 px-6 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Store className="w-5 h-5" />
                  <span>ค้นหาร้านค้าใกล้ฉัน</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========== LOADING STATE ========== */}
        {isScanLoading && !scanResult && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <Loading />
          </div>
        )}

        {/* ========== PERMISSION/UPLOAD STATE ========== */}
        {!isScanLoading && !scanResult && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative">
            {/* Decorative background circles */}
            <div className="absolute top-10 right-4 w-32 h-32 bg-primary/5 rounded-full scan-rotate-bg" />
            <div className="absolute bottom-20 left-4 w-20 h-20 bg-primary/5 rounded-full" />

            {/* Icon with animations */}
            <div className="relative mb-8">
              <div className="relative scan-float">
                {/* Pulsing rings */}
                <div className="absolute inset-0 w-32 h-32 -m-2 rounded-3xl border-2 border-primary/30 scan-pulse-ring" />
                <div className="absolute inset-0 w-32 h-32 -m-2 rounded-3xl border border-primary/20 scan-pulse-ring-delay" />

                {/* Main Icon Container */}
                <div className="relative w-28 h-28 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl shadow-primary/30">
                  <Camera className="w-14 h-14 text-white" />
                </div>

                {/* Sparkle decorations */}
                <div className="absolute -top-2 -right-2 scan-sparkle-1">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div className="absolute -bottom-1 -left-3 scan-sparkle-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="absolute top-1/2 -right-5 scan-sparkle-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>

                {/* ImagePlus badge */}
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                  <ImagePlus className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              เริ่มสแกนเนื้อของคุณ
            </h1>

            {/* Description */}
            <p className="text-gray-500 mb-8 leading-relaxed max-w-xs">
              ถ่ายภาพหรือเลือกภาพจากอัลบั้ม
              <br />
              เพื่อให้ AI ตรวจสอบความสดของเนื้อ
            </p>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Upload Button with shimmer */}
            <button
              onClick={handleFileSelect}
              className="w-full max-w-xs scan-shimmer-btn text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] scan-bounce-btn"
            >
              <Camera className="w-5 h-5" />
              <span>เลือกภาพหรือถ่ายรูป</span>
            </button>

            {/* Hint */}
            <p className="text-xs text-gray-400 mt-5">
              รองรับไฟล์ภาพ JPG, PNG
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default ScanMethodScreen;
