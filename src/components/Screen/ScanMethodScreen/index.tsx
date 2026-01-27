import { Camera } from "lucide-react";
import { useAppContext } from "../../../AppContext";

function ScanMethodScreen() {
  const {
    fileInputRef,
    handleFileUpload,
    scanResult,
    isScanLoading,
    selectedImage,
  } = useAppContext();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const bgColorFromPredictClass = (intense?: boolean) => {
    if (scanResult?.predicted_class === "fresh") {
      return intense ? "bg-green-600" : "bg-green-50";
    } else if (scanResult?.predicted_class === "rotten") {
      return intense ? "bg-yellow-600" : "bg-yellow-50";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return intense ? "bg-red-500" : "bg-red-50";
    } else {
      return "bg-white";
    }
  };

  const textColorFromPredictClass = () => {
    if (scanResult?.predicted_class === "fresh") {
      return "text-green-600";
    } else if (scanResult?.predicted_class === "rotten") {
      return "text-yellow-600";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return "text-red-600";
    } else {
      return "text-black";
    }
  };

  const getTextFromPredictClass = () => {
    if (scanResult?.predicted_class === "fresh") {
      return "สด";
    } else if (scanResult?.predicted_class === "rotten") {
      return "เสี่ยง";
    } else if (scanResult?.predicted_class === "Invalid (Non-Meat)") {
      return "ไม่ถูกต้อง (ไม่ใช่เนื้อสัตว์)";
    } else {
      return "";
    }
  };

  return (
    <div className={`p-4 min-h-dvh mt-18 ${bgColorFromPredictClass()}`}>
      {!isScanLoading && scanResult && (
        <div className="flex flex-col mt-4 gap-5 relative">
          <h1 className="text-3xl font-semibold text-black flex gap-2 justify-center">
            ผลการประเมิน:{""}
            <span className={textColorFromPredictClass()}>
              {getTextFromPredictClass()}
            </span>
          </h1>
          <img
            alt={"scan-result-img"}
            src={selectedImage as string}
            className="max-h-[320px] object-cover rounded-xl"
          />
          <div className="shadow-xl bg-white rounded-xl p-6 mt-6 absolute bottom-[-335px] h-full w-full left-0">
            <div
              className={`${bgColorFromPredictClass(
                true
              )} rounded-full border-2 border-white shadow text-center w-24 p-2`}
            >
              <span className="text-white">{getTextFromPredictClass()}</span>
            </div>
            ความมั่นใจในการประเมินผล:{" "}
            <span className="font-semibold">
              {scanResult
                ? (scanResult.confidence * 100).toFixed(2) + "%"
                : "N/A"}
            </span>
          </div>
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
        <div className="text-center flex-1 flex flex-col justify-center">
          <h1 className="text-4xl text-shadow-md  font-bold text-primary mb-8">
            ให้สิทธิการใช้งานกล้อง
          </h1>

          <div className="text-2xl text-gray-700 mb-16 leading-relaxed">
            เพื่อให้สามารถสแกนและเปิดได้
            <br />
            ระบบต้องเข้าถึงกล้องของคุณ
          </div>

          <div className="">
            <div className="bg-blue-primary rounded-[24px] p-8 mb-8 inline-block">
              <Camera className="w-16 h-16 text-white mx-auto" />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <>
            <div className="space-y-6 flex items-center justify-center flex-col m-auto w-full">
              <button
                onClick={handleFileSelect}
                className="bg-primary text-white px-8 py-2 rounded-[24px] text-2xl font-medium w-full cursor-pointer"
              >
                อนุญาต
              </button>

              {/* <button
              onClick={() => setCurrentScreen("steps")}
              className="text-gray-600 text-base"
            >
              ภายหลัง
            </button> */}
            </div>
          </>
        </div>
      )}
    </div>
  );
}

export default ScanMethodScreen;
