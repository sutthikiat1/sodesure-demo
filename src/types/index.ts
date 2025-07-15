// src/types/index.ts
export type Screen =
  | "welcome"
  | "features"
  | "permission"
  | "camera"
  | "analyzing"
  | "results-fresh"
  | "results-poor";

export interface FreshnessResult {
  status: "fresh" | "poor";
  confidence: number;
  timestamp: string;
  location?: string;
}

export interface CameraCapture {
  imageData: string;
  timestamp: string;
  source: "camera" | "upload";
}
