import { Search, Camera } from "lucide-react";
import LayoutScreen from "../../Layout/LayoutScreen";
import { useAppContext } from "../../../AppContext";

function ResultScreen() {
  const {
    selectedImage,
    setCurrentScreen,
    setSelectedImage,
    setStream,
    stream,
    scanResult,
  } = useAppContext();

  const MeatImage = () => (
    <div
      className={` bg-gray-200 aspect-square rounded-lg mx-auto overflow-hidden relative`}
    >
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="Meat sample"
          className=" aspect-square object-cover max-h-[250px]"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-red-300 via-red-400 to-red-500 flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-lg shadow-inner"></div>
        </div>
      )}
      <Search className="absolute top-2 right-2 w-4 h-4 text-gray-600" />
    </div>
  );

  const resetApp = () => {
    setCurrentScreen("welcome");
    setSelectedImage(null);

    if (stream && setStream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const confidence = ((scanResult?.confidence as number) * 100).toFixed(1);

  return (
    <LayoutScreen screen="result">
      <div className="flex flex-1 flex-col">
        <p className="text-sm text-end text-gray-500 mb-8">
          สแกนล่าสุด: {getCurrentTime()} น.
        </p>
        <h1 className="text-4xl text-shadow-md text-center font-bold text-primary mb-8">
          ผลการวิเคราะห์
        </h1>

        <div className="text-center flex flex-col flex-1 gap-[24px] justify-center h-full ">
          <MeatImage />
          <div className="flex flex-col items-center flex-1 gap-2">
            <div className="flex gap-2  text-center items-center">
              <span className=" text-3xl">ผลการแสดง : </span>
              <span
                className={`text-gray-500 text-3xl font-semibold ${
                  scanResult?.predicted_class === "fresh"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {scanResult?.predicted_class === "fresh" ? "มีความสด" : "ไม่สด"}
              </span>
            </div>
            <div
              className={`w-full relative h-[44px] rounded-[24px]  ${
                scanResult?.predicted_class === "fresh"
                  ? `border-green-200 bg-green-50`
                  : ` border-red-200/50 bg-red-50`
              } border-2 `}
            >
              <div
                className={`h-full ${
                  scanResult?.predicted_class === "fresh"
                    ? `bg-green-700`
                    : `bg-red-700/50`
                } rounded-[24px]`}
                style={{ width: `${confidence}%` }}
              ></div>
              <div className="absolute text-1xl text-white left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2">
                {confidence}%
              </div>
            </div>
          </div>

          <div className="">
            <button
              onClick={resetApp}
              className="bg-primary min-h-[50px] text-white px-6 py-2 rounded-[24px] font-medium w-full flex items-center justify-center text-2xl"
            >
              <Camera className="w-[32px] h-[32px] mr-2" />
              สแกนใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    </LayoutScreen>
  );
}

export default ResultScreen;
