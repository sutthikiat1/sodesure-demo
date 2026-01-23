import React, {
  useState,
  createContext,
  useContext,
  type ReactNode,
  useRef,
  useEffect,
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
  | "map"
  | "history";

export interface HistoryItem {
  id: string;
  imageUrl: string;
  result: "fresh" | "poor";
  confidence: number;
  timestamp: Date;
}

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
  scanHistory: HistoryItem[];
  addScanHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  deleteScanHistory: (id: string) => void;
  clearAllHistory: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  // Camera functions
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  analyzeMeat: (data: IResponsePredict, imageUrl: string) => Promise<void>;
  resetApp: () => void;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Local Storage Key
const STORAGE_KEY = "sodSureHistory";

// Context Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<IResponsePredict | null>(null);
  const [scanHistory, setScanHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        console.log("🔍 Loading history from localStorage...");
        const savedHistory = localStorage.getItem(STORAGE_KEY);

        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          console.log("📦 Raw data from localStorage:", parsed);

          // Convert timestamp strings back to Date objects
          const historyWithDates = parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));

          setScanHistory(historyWithDates);
          console.log(
            "✅ Successfully loaded history:",
            historyWithDates.length,
            "items"
          );
          console.table(historyWithDates);
        } else {
          console.log("ℹ️ No saved history found in localStorage");
        }
      } catch (error) {
        console.error("❌ Error loading scan history:", error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsHistoryLoaded(true);
      }
    };

    loadHistory();
  }, []);

  // Save history to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (!isHistoryLoaded) {
      console.log("⏳ Waiting for history to load before saving...");
      return;
    }

    try {
      console.log("💾 Saving to localStorage:", scanHistory.length, "items");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scanHistory));
      console.log("✅ Successfully saved to localStorage!");

      // Verify save
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("🔍 Verification - Items in storage:", parsed.length);
      }
    } catch (error) {
      console.error("❌ Error saving scan history:", error);
    }
  }, [scanHistory, isHistoryLoaded]);

  // Add scan to history
  const addScanHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    console.log("Adding new scan to history:", newItem);

    setScanHistory((prev) => {
      const updated = [newItem, ...prev];
      console.log("📊 Updated history length:", updated.length);
      console.log("📝 Full updated history:", updated);
      return updated;
    });
  };

  // Delete scan from history
  const deleteScanHistory = (id: string) => {
    console.log("🗑️ Deleting scan:", id);
    setScanHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      console.log("📊 Remaining items:", updated.length);
      return updated;
    });
  };

  // Clear all history
  const clearAllHistory = () => {
    console.log("🧹 Clearing all history");
    setScanHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

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
      console.log("📁 File selected:", file.name, file.type, file.size);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        console.log("🖼️ Image loaded, length:", imageUrl.length);

        setSelectedImage(imageUrl);
        setIsAnalyzing(true);
        setCurrentScreen("analyzing");

        const formData = new FormData();
        formData.append(`file`, file);

        try {
          console.log("🚀 Calling API...");
          const response = await servicePredict(formData);
          console.log("🤖 API Response:", response);
          await analyzeMeat(response, imageUrl);
        } catch (error) {
          console.error("❌ Error during prediction:", error);
          setIsAnalyzing(false);
          alert("เกิดข้อผิดพลาดในการวิเคราะห์");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Analysis Function
  const analyzeMeat = async (
    data: IResponsePredict,
    imageUrl: string
  ): Promise<void> => {
    return new Promise((resolve) => {
      console.log("⏱️ Starting analysis timeout...");
      console.log(
        "Image URL received:",
        imageUrl ? `length: ${imageUrl.length}` : "MISSING!"
      );

      setTimeout(() => {
        console.log("Analysis timeout completed");
        console.log("Response data:", data);

        if (data.predicted_class) {
          console.log("Valid prediction received");
          setScanResult(data);
          setIsAnalyzing(false);
          setCurrentScreen("result");

          // Add to history IMMEDIATELY with the imageUrl parameter
          if (imageUrl) {
            console.log("Image URL exists, adding to history...");
            console.log("Image URL length:", imageUrl.length);

            const historyItem = {
              imageUrl: imageUrl,
              result:
                data.predicted_class === "fresh"
                  ? ("fresh" as const)
                  : ("poor" as const),
              confidence: data.confidence,
            };

            console.log("History item to save:", historyItem);
            addScanHistory(historyItem);

            // Force verify immediately
            setTimeout(() => {
              const saved = localStorage.getItem(STORAGE_KEY);
              console.log("Immediate verification - localStorage:", saved);
            }, 100);
          } else {
            console.error("❌ No imageUrl provided to analyzeMeat!");
          }
        } else {
          console.error("❌ No predicted_class in response:", data);
        }

        resolve();
      }, 2000);
    });
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
    scanHistory,
    addScanHistory,
    deleteScanHistory,
    clearAllHistory,
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
