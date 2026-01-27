import {
  Camera,
  BadgeAlert,
  BadgeX,
  BadgeCheck,
  Store,
  ImagePlus,
  RefreshCw,
} from "lucide-react";
import { useAppContext } from "../../../AppContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../Layout/Loading";

// Animation styles for result state
const animationStyles = `
  @keyframes shimmer-bg {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.02);
    }
  }

  @keyframes badge-bounce {
    0%, 100% {
      transform: translateX(-50%) scale(1);
    }
    50% {
      transform: translateX(-50%) scale(1.05);
    }
  }

  @keyframes icon-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  @keyframes ring-pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.4;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.8;
    }
  }

  .shimmer-fresh {
    background: linear-gradient(
      90deg,
      rgba(34, 197, 94, 0.1) 0%,
      rgba(34, 197, 94, 0.4) 50%,
      rgba(34, 197, 94, 0.1) 100%
    );
    background-size: 200% 100%;
    animation: shimmer-bg 2.5s ease-in-out infinite;
  }

  .shimmer-rotten {
    background: linear-gradient(
      90deg,
      rgba(245, 158, 11, 0.1) 0%,
      rgba(245, 158, 11, 0.4) 50%,
      rgba(245, 158, 11, 0.1) 100%
    );
    background-size: 200% 100%;
    animation: shimmer-bg 2.5s ease-in-out infinite;
  }

  .shimmer-invalid {
    background: linear-gradient(
      90deg,
      rgba(239, 68, 68, 0.1) 0%,
      rgba(239, 68, 68, 0.4) 50%,
      rgba(239, 68, 68, 0.1) 100%
    );
    background-size: 200% 100%;
    animation: shimmer-bg 2.5s ease-in-out infinite;
  }

  .glow-fresh {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .glow-rotten {
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.2);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .glow-invalid {
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.4), 0 0 60px rgba(239, 68, 68, 0.2);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .badge-animate {
    animation: badge-bounce 2s ease-in-out infinite;
  }

  .icon-animate {
    animation: icon-pulse 1.5s ease-in-out infinite;
  }

  .ring-animate {
    animation: ring-pulse 2s ease-in-out infinite;
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

  // Animation class helpers
  const getShimmerClass = () => {
    if (scanResult?.predicted_class === "fresh") return "shimmer-fresh";
    if (scanResult?.predicted_class === "rotten") return "shimmer-rotten";
    return "shimmer-invalid";
  };

  const getGlowClass = () => {
    if (scanResult?.predicted_class === "fresh") return "glow-fresh";
    if (scanResult?.predicted_class === "rotten") return "glow-rotten";
    return "glow-invalid";
  };

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

            {/* Image with badge and animated background */}
            <div className="relative">
              {/* Animated shimmer background */}
              <div
                className={`absolute -inset-3 rounded-[32px] ${getShimmerClass()}`}
              />
              {/* Animated glow ring */}
              <div
                className={`absolute -inset-1.5 rounded-[28px] ring-animate ${getGlowClass()}`}
              />
              {/* Image container */}
              <div
                className={`relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-xl bg-gray-100 ${getGlowClass()}`}
              >
                <img
                  alt="scan-result"
                  src={selectedImage as string}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status Badge with animation */}
              <div
                className={`absolute -bottom-4 left-1/2 badge-animate ${bgColorFromPredictClass(
                  true
                )} rounded-full px-5 py-2 shadow-lg border-4 border-white`}
              >
                <span className="text-white text-base font-semibold inline-flex items-center gap-2">
                  <span className="icon-animate inline-flex">
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
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-lg">
                <Camera className="w-14 h-14 text-white" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ImagePlus className="w-4 h-4 text-primary" />
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

            {/* Upload Button */}
            <button
              onClick={handleFileSelect}
              className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Camera className="w-5 h-5" />
              <span>เลือกภาพหรือถ่ายรูป</span>
            </button>

            {/* Hint */}
            <p className="text-xs text-gray-400 mt-4">
              รองรับไฟล์ภาพ JPG, PNG
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default ScanMethodScreen;
