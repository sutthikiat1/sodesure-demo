import { RotateCcw, MoreHorizontal, Search } from "lucide-react";
import { useRef } from "react";
import { useAppContext } from "../../../AppContext";

function CameraScreen() {
  const {
    setCurrentScreen,
    selectedImage,
    setSelectedImage,
    stream,
    setStream,
  } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setSelectedImage(imageData);

        // Stop camera
        if (stream && setStream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      }
    }
  };

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

  return (
    <div className="relative w-screen h-screen bg-gray-900">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-between items-center text-white text-sm">
        <span>1/8</span>
        <span>HDR</span>
        <div className="flex items-center">
          <div className="w-6 h-6 border border-white rounded-full mr-4"></div>
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center pt-16 pb-32">
        <MeatImage className="w-64 h-40" />
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-30"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6">
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
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white"
          >
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300"></div>
          </button>

          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (stream && setStream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
          }
          setCurrentScreen("scan-method");
        }}
        className="absolute top-6 left-6 text-white text-2xl"
      >
        ✕
      </button>
    </div>
  );
}

export default CameraScreen;
