import React, {
  useState,
  createContext,
  useContext,
  type ReactNode,
  useRef,
} from "react";

// Types
export interface ScanResult {
  quality: "excellent" | "good" | "poor";
  freshness: number;
  confidence: number;
}

export type Screen =
  | "welcome"
  | "steps"
  | "scan-method"
  | "camera"
  | "analyzing"
  | "result";

// Context Types
interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  // Camera functions
  startCamera: () => Promise<void>;
  capturePhoto: () => void;
  stopCamera: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  analyzeMeat: () => Promise<void>;
  resetApp: () => void;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start Camera Function
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setCurrentScreen("camera");
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("ไม่สามารถเข้าถึงกล้องได้");
    }
  };

  // Capture Photo Function
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
        stopCamera();

        // Start analysis
        analyzeMeat();
      }
    }
  };

  // Stop Camera Function
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Handle File Upload
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

  // Mock Analysis Function
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

    setScanResult(mockResult);
    setIsAnalyzing(false);
    setCurrentScreen("result");
  };

  // Reset App Function
  const resetApp = () => {
    setCurrentScreen("welcome");
    setSelectedImage(null);
    setScanResult(null);
    setIsAnalyzing(false);
    stopCamera();
  };

  const value: AppContextType = {
    currentScreen,
    setCurrentScreen,
    selectedImage,
    setSelectedImage,
    stream,
    setStream,
    isAnalyzing,
    setIsAnalyzing,
    scanResult,
    setScanResult,
    videoRef,
    fileInputRef,
    canvasRef,
    startCamera,
    capturePhoto,
    stopCamera,
    handleFileUpload,
    analyzeMeat,
    resetApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
