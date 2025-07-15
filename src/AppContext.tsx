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

export interface ScanResult {
  quality: "excellent" | "good" | "poor";
  freshness: number;
  confidence: number;
}

// Context Types
interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  stream?: MediaStream | null;
  setStream?: (stream: MediaStream | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  scanResult?: ScanResult | null;
  setScanResult?: (result: ScanResult | null) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
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
  const videoRef = useRef<HTMLVideoElement>(null as HTMLVideoElement | null);
  const fileInputRef = useRef<HTMLInputElement>(
    null as HTMLInputElement | null
  );

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
