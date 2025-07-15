/* eslint-disable @typescript-eslint/no-unused-vars */
import { Camera } from "lucide-react";
import LayoutScreen from "../../Layout/LayoutScreen";
import { useAppContext, type ScanResult } from "../../../AppContext";
import { useRef } from "react";

function ScanMethodScreen() {
  const {
    setCurrentScreen,
    setSelectedImage,
    setStream,
    setIsAnalyzing,
    setScanResult,
    videoRef,
    fileInputRef,
  } = useAppContext();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (setStream) {
        setStream(mediaStream as MediaStream);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCurrentScreen("camera");
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("ไม่สามารถเข้าถึงกล้องได้");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        analyzeMeat();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMeat = async () => {
    setIsAnalyzing(true);
    setCurrentScreen("analyzing");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockResult: ScanResult = {
      quality: Math.random() > 0.7 ? "excellent" : "good",
      freshness: Math.floor(Math.random() * 30) + 70,
      confidence: Math.floor(Math.random() * 10) + 90,
    };

    if (setScanResult) {
      setScanResult(mockResult || null);
    }
    setIsAnalyzing(false);
    setCurrentScreen("result");
  };

  return (
    <LayoutScreen screen={"camera"}>
      <div className="px-6 py-8 text-center">
        <h1 className="text-xl font-bold text-primary mb-8">
          ให้สิทธิการใช้งานกล้อง
        </h1>

        <div className="text-base text-gray-700 mb-16 leading-relaxed">
          เพื่อให้สามารถแกนและเปิดได้
          <br />
          ระบบต้องเข้าถึงกล้องของคุณ
        </div>

        <div className="mb-16">
          <div className="bg-blue-primary rounded-2xl p-8 mb-8 inline-block">
            <Camera className="w-16 h-16 text-white mx-auto" />
          </div>
        </div>

        <div className="space-y-6">
          <button
            onClick={startCamera}
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium w-full"
          >
            อนุญาต
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-600 text-base"
          >
            ภายหลัง
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </LayoutScreen>
  );
}

export default ScanMethodScreen;
