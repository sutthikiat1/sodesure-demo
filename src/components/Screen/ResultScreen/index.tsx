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

  return (
    <LayoutScreen screen="result">
      <div className="px-6 py-6">
        <p className="text-sm text-gray-500 mb-8">สแกนล่าสุด: 16:30 น.</p>

        <div className="text-center mb-8">
          <MeatImage className="aspect-square mb-8 " />

          <div className="mb-6">
            <div className="text-lg font-bold text-gray-800 mb-4">
              ผลการแสดง : สดมากกกกก!!!!
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetApp}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium w-full flex items-center justify-center"
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
