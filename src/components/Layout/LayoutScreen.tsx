import React from "react";
import styled from "styled-components";
import { Menu } from "lucide-react";
import { useAppContext } from "../../AppContext";
import AXONS from "../../assets/axons.svg";

const Navbar = () => (
  <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
    <Menu className="w-5 h-5" />
    <img src={AXONS} alt="Axons Logo" className="w-8 h-8" />
  </div>
);

function LayoutScreen({
  children,
  screen,
}: {
  children: React.ReactNode;
  screen:
    | "welcome"
    | "steps"
    | "scan-method"
    | "camera"
    | "analyzing"
    | "result";
}) {
  const { currentScreen, setCurrentScreen, fileInputRef } = useAppContext();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const StepIndicator = () => {
    const steps = [
      "welcome",
      "steps",
      "scan-method",
      "camera",
      "analyzing",
      "result",
    ];
    const currentStepIndex = steps.indexOf(currentScreen);

    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStepIndex
                  ? "bg-black w-8"
                  : index < currentStepIndex
                  ? "bg-gray-400"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };
  return (
    <BoxLayoutScreen>
      <Navbar />
      <div className="px-6 py-8 flex-1 h-full flex flex-col">
        <div className="flex flex-col max-h-[80%] h-full flex-1">
          {children}
        </div>
        {currentScreen !== "result" && (
          <div className="h-full flex-1 max-h-[200px] flex items-end cursor-pointer">
            <div className="flex-1 flex items-end pb-6">
              {currentScreen !== "scan-method" ? (
                <>
                  <button
                    onClick={() => setCurrentScreen(screen)}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-medium w-full"
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-6 flex items-center justify-center flex-col m-auto w-full">
                    <button
                      onClick={handleFileSelect}
                      className="bg-primary text-white px-8 py-3 rounded-lg font-medium w-full cursor-pointer"
                    >
                      อนุญาต
                    </button>

                    <button
                      onClick={() => setCurrentScreen("steps")}
                      className="text-gray-600 text-base"
                    >
                      ภายหลัง
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <StepIndicator />
    </BoxLayoutScreen>
  );
}

const BoxLayoutScreen = styled.section`
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  background-color: "#f3f4f6";
  display: flex;
  flex-direction: column;
`;

export default LayoutScreen;
