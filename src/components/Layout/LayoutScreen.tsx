import React from "react";
import styled from "styled-components";
import { useAppContext } from "../../AppContext";
import AXONS from "../../assets/axons.svg";

const Navbar = () => (
  <div className="p-4 text-end flex items-center justify-center">
    <img src={AXONS} alt="Axons Logo" className="w-[56px] h-[56px]" />
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
      <div className="mt-[24px] flex items-center justify-center">
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
      <BoxWrapper className="flex-1 h-full flex flex-col py-[32px] px-[32px] items-center shadow-2xs">
        <div className="flex-1 h-full flex flex-col  ">
          <div className="flex flex-col max-h-[80%] h-full flex-1">
            {children}
          </div>
          {currentScreen !== "result" && currentScreen !== "analyzing" && (
            <div className="h-full flex-1 max-h-[200px] flex items-end cursor-pointer">
              <div className="flex-1 flex items-end">
                {currentScreen !== "scan-method" ? (
                  <>
                    <button
                      onClick={() => setCurrentScreen(screen)}
                      className="bg-primary text-white px-8 py-2 rounded-[24px] text-2xl font-medium w-full"
                    >
                      ต่อไป
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-6 flex items-center justify-center flex-col m-auto w-full">
                      <button
                        onClick={handleFileSelect}
                        className="bg-primary text-white px-8 py-2 rounded-[24px] text-2xl font-medium w-full cursor-pointer"
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
      </BoxWrapper>
      <div className="flex-1 max-h-[50px]">
        <StepIndicator />
      </div>
    </BoxLayoutScreen>
  );
}

const BoxLayoutScreen = styled.section`
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const BoxWrapper = styled.div`
  box-shadow: 8px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  background-color: white;
`;

export default LayoutScreen;
