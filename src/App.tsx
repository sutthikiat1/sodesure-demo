import React from "react";
import { useAppContext } from "./AppContext.tsx";

import WelcomeScreen from "./components/Screen/WelcomeScreen/index.tsx";
import FeaturesScreen from "./components/Screen/FeaturesScreen/index.tsx";
import StepsScreen from "./components/Screen/StepsScreen/index.tsx";
import ScanMethodScreen from "./components/Screen/ScanMethodScreen/index.tsx";
import AnalyzingScreen from "./components/Screen/AnalyzingScreen/index.tsx";
import ResultScreen from "./components/Screen/ResultScreen/index.tsx";
import MapScreen from "./components/Screen/MapScreen/index.tsx";

const MeatFreshnessScanner: React.FC = () => {
  const { currentScreen } = useAppContext();

  return (
    <div className="min-w-screen min-h-screen overflow-y-auto">
      {currentScreen === "welcome" && <WelcomeScreen />}
      {currentScreen === "features" && <FeaturesScreen />}
      {currentScreen === "steps" && <StepsScreen />}
      {currentScreen === "scan-method" && <ScanMethodScreen />}
      {currentScreen === "analyzing" && <AnalyzingScreen />}
      {currentScreen === "result" && <ResultScreen />}
      {currentScreen === "map" && <MapScreen />}
    </div>
  );
};

export default MeatFreshnessScanner;
