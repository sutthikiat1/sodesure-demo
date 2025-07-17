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

  const MeatImage = ({ className = "w-48 h-32" }: { className?: string }) => (
    <div
      className={`${className} bg-gray-200 rounded-lg mx-auto overflow-hidden relative`}
    >
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="Meat sample"
          className="w-full h-full object-cover"
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
      <div className="px-6 py-6">
        <p className="text-sm text-gray-500 mb-8">
          สแกนล่าสุด: {getCurrentTime()} น.
        </p>

        <div className="text-center mb-8">
          <MeatImage className="aspect-square mb-8 " />

          <div className="mb-6">
            <div className=" text-primary text-3xl mb-4">
              ผลการแสดง :{" "}
              {scanResult?.quality === "fresh" ? "มีความสด" : "ไม่สด"}
            </div>
            <div className="w-full relative h-[44px] rounded-[24px] bg-green-50 border-2 border-green-100">
              <div
                className="h-full bg-primary rounded-[24px]"
                style={{ width: `${confidence}%` }}
              ></div>
              <div className="absolute text-1xl text-green-200 left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2">
                {confidence}%
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-[80px]">
            <button
              onClick={resetApp}
              className="bg-primary min-h-[66px] text-white px-6 py-3 rounded-lg font-medium w-full flex items-center justify-center text-2xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              สแกนใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    </LayoutScreen>
  );
}

export default ResultScreen;
