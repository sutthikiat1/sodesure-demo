import React, {
  useState,
  createContext,
  useContext,
  type ReactNode,
  useRef,
} from "react";
import { servicePredict, type IResponsePredict } from "./services/demo";

export type Screen =
  | "welcome"
  | "features"
  | "steps"
  | "scan-method"
  | "camera"
  | "analyzing"
  | "result"
  | "map";

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
  scanResult: IResponsePredict | null;
  setScanResult: (result: IResponsePredict | null) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  // Camera functions
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  analyzeMeat: (data: IResponsePredict) => Promise<void>;
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
  const [scanResult, setScanResult] = useState<IResponsePredict | null>(null);

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
      reader.onload = async (e) => {
        setIsAnalyzing(true);
        setCurrentScreen("analyzing");
        setSelectedImage(e.target?.result as string);
        const formData = new FormData();
        formData.append(`file`, file);
        const response = await servicePredict(formData);
        analyzeMeat(response);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock Analysis Function
  const analyzeMeat = async (data: IResponsePredict) => {
    setTimeout(() => {
      if (data.predicted_class) {
        // Simulate API call
        setScanResult(data);
        setIsAnalyzing(false);
        setCurrentScreen("result");
      }
    }, 2000);
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
