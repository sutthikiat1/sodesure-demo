import { Camera, BadgeAlert, BadgeX, BadgeCheck, Store } from "lucide-react";
import { useAppContext } from "../../../AppContext";

function ScanMethodScreen() {
  const {
    fileInputRef,
    handleFileUpload,
    scanResult,
    isScanLoading,
    selectedImage,
    resetStateScan,
  } = useAppContext();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const bgColorFromPredictClass = (intense?: boolean) => {
    if (scanResult?.predicted_class === "fresh") {
      return intense ? "bg-primary" : "bg-green-50";
    } else if (scanResult?.predicted_class === "rotten") {
      return intense ? "bg-yellow-600" : "bg-yellow-50";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return intense ? "bg-red-600" : "bg-red-50";
    } else {
      return "bg-white";
    }
  };

  const textColorFromPredictClass = () => {
    if (scanResult?.predicted_class === "fresh") {
      return "text-primary";
    } else if (scanResult?.predicted_class === "rotten") {
      return "text-yellow-600";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return "text-red-600";
    } else {
      return "text-gray-600";
    }
  };

  const getIconFromPredictClass = () => {
    if (scanResult?.predicted_class === "fresh") {
      return <BadgeCheck className="text-white" />;
    } else if (scanResult?.predicted_class === "rotten") {
      return <BadgeAlert className="text-white" />;
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return <BadgeX className="text-white" />;
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
        return "text-yellow-600";
      } else if (scanResult.confidence < 0.5) {
        return "text-red-600";
      }
    }
  };

  const getBgColorPercent = () => {
    if (scanResult?.confidence) {
      if (scanResult?.confidence >= 0.8) {
        return "bg-green-600";
      } else if (scanResult.confidence >= 0.4) {
        return "bg-yellow-600";
      } else if (scanResult.confidence < 0.4) {
        return "bg-red-600";
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

  // useEffect(() => {
  //   resetStateScan();
  // }, []);

  return (
    <div className={`p-4 min-h-dvh mt-18 ${bgColorFromPredictClass()}`}>
      {!isScanLoading && scanResult && (
        <div className="flex flex-col mt-4 gap-5">
          <h1 className="text-2xl font-semibold text-gray-600 flex gap-2 justify-center">
            ผลการประเมิน:{""}
            <span className={textColorFromPredictClass()}>
              {getTextFromPredictClass()}
            </span>
          </h1>
          <img
            alt={"scan-result-img"}
            src={selectedImage as string}
            className="max-h-[320px] object-cover rounded-3xl shadow-md "
          />
          <div className="drop-shadow-md bg-white rounded-3xl p-6 w-full left-0 flex flex-col gap-4 relative">
            <div
              className={`${bgColorFromPredictClass(
                true,
              )} rounded-full border-3 border-white text-center -top-10 px-4 py-2 absolute left-1/2 -translate-x-1/2 z-10`}
            >
              <span className="text-white text-2xl inline-flex items-center gap-2">
                {getIconFromPredictClass()}
                {getTextFromPredictClass(true)}
              </span>
            </div>
            <div className="flex flex-col gap-4 text-gray-600">
              <div className="flex justify-between w-full">
                <span>ระดับความเชื่อมั่น (AI Condifence)</span>
                <span className={getTextColorPercent()}>
                  {scanResult
                    ? (scanResult.confidence * 100).toFixed(0) + "%"
                    : "N/A"}
                </span>
              </div>
              <div className="relative w-full bg-gray-200 h-4 rounded-full">
                <div
                  className={`absolute ${getBgColorPercent()} h-4 rounded-full`}
                  style={{ width: `${(scanResult?.confidence ?? 0) * 100}%` }}
                ></div>
              </div>
              <div className="h-[0.5px] w-full bg-gray-200 "></div>
              <div className="text-xl text-center w-full">
                {getDescriptionFromPredictClass()}
              </div>
            </div>
          </div>
          <div
            onClick={resetStateScan}
            className="rounded-3xl text-gray-600 w-full bg-white shadow-md px-6 py-4 flex gap-4"
          >
            <Camera />
            <span>Scan อีกครั้ง</span>
          </div>
          {scanResult?.predicted_class !== "fresh" && (
            <div className="rounded-3xl text-gray-600 w-full bg-white shadow-md px-6 py-4 flex gap-4">
              <Store />
              <span>ค้นหาร้านค้าใกล้ฉัน</span>
            </div>
          )}
        </div>
      )}

      {isScanLoading && !scanResult && (
        <div className="text-2xl text-gray-700 mb-16 leading-relaxed">
          กำลังประมวลผลภาพถ่ายของคุณ...
          <br />
          กรุณารอสักครู่
        </div>
      )}
      {!isScanLoading && !scanResult && (
        <div className="text-center flex-1 flex flex-col justify-center items-center mt-20">
          <div className="bg-blue-primary rounded-[24px] p-8 mb-8 inline-block">
            <Camera className="w-16 h-16 text-white mx-auto" />
          </div>
          <h1 className="text-2xl text-shadow-md  font-bold text- mb-8">
            ให้สิทธิการใช้งานกล้อง
          </h1>

          <div className="text-xl text-gray-700 mb-16 leading-relaxed">
            เพื่อให้สามารถสแกนและเปิดได้
            <br />
            ระบบต้องเข้าถึงกล้องของคุณ
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="space-y-6 flex items-center justify-center flex-col m-auto w-full">
            <button
              onClick={handleFileSelect}
              className="bg-primary text-white px-8 py-3 rounded-[24px] text-xl font-medium w-full cursor-pointer"
            >
              อนุญาต
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScanMethodScreen;
