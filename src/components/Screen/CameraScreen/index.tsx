import { RotateCcw, MoreHorizontal, Search } from "lucide-react";
import { useAppContext } from "../../../AppContext";

function CameraScreen() {
  const {
    setCurrentScreen,
    selectedImage,
    capturePhoto,
    stopCamera,
    videoRef,
    canvasRef,
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

  const handleCloseCamera = () => {
    stopCamera();
    setCurrentScreen("scan-method");
  };

  return (
    <div className="relative w-screen h-screen bg-gray-900">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-between items-center text-white text-sm z-10">
        <span>1/8</span>
        <span>HDR</span>
        <div className="flex items-center">
          <div className="w-6 h-6 border border-white rounded-full mr-4"></div>
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>

      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay with meat image preview */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black bg-opacity-20 rounded-lg p-4">
          <MeatImage className="w-64 h-40" />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6 z-10">
        <div className="flex justify-center items-center space-x-4 mb-6 text-white text-sm">
          <span className="text-gray-300">Short video</span>
          <span className="text-gray-300">Video</span>
          <span className="font-bold">Photo</span>
          <span className="text-gray-300">Portrait</span>
          <span className="text-gray-300">1:1</span>
        </div>

        <div className="flex justify-center items-center space-x-8">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>

          <button
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300"></div>
          </button>

          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleCloseCamera}
        className="absolute top-6 left-6 text-white text-2xl z-10 hover:text-gray-300 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export default CameraScreen;
