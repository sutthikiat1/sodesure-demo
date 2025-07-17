import React from "react";
import { useAppContext } from "./AppContext.tsx";

import WelcomeScreen from "./components/Screen/WelcomeScreen/index.tsx";
import StepsScreen from "./components/Screen/StepsScreen/index.tsx";
import ScanMethodScreen from "./components/Screen/ScanMethodScreen/index.tsx";
import AnalyzingScreen from "./components/Screen/AnalyzingScreen/index.tsx";
import ResultScreen from "./components/Screen/ResultScreen/index.tsx";

const MeatFreshnessScanner: React.FC = () => {
  const { currentScreen } = useAppContext();

  return (
    <div className="  w-screen h-screen overflow-hidden">
      {currentScreen === "welcome" && <WelcomeScreen />}
      {currentScreen === "steps" && <StepsScreen />}
      {currentScreen === "scan-method" && <ScanMethodScreen />}
      {currentScreen === "analyzing" && <AnalyzingScreen />}
      {currentScreen === "result" && <ResultScreen />}
    </div>
  );
};

export default MeatFreshnessScanner;
