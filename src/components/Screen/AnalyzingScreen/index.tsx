import LayoutScreen from "../../Layout/LayoutScreen";
import { Search } from "lucide-react";
import { useAppContext } from "../../../AppContext";

function AnalyzingScreen() {
  const { selectedImage } = useAppContext();

  // Mock meat image component
  const MeatImage = () => (
    <div
      className={` bg-gray-200 aspect-square rounded-lg mx-auto overflow-hidden relative`}
    >
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="Meat sample"
          className=" aspect-square object-cover max-h-[300px]"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-red-300 via-red-400 to-red-500 flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-lg shadow-inner"></div>
        </div>
      )}
      <Search className="absolute top-2 right-2 w-4 h-4 text-gray-600" />
    </div>
  );
  return (
    <LayoutScreen screen="analyzing">
      <div className=" text-center">
        <h1 className="text-4xl font-bold  text-shadow-md   text-primary mb-8">
          กำลังวิเคราะห์...
        </h1>

        <div className="mb-8">
          <MeatImage />
        </div>

        <div className="">
          <div className="w-16 h-16 mx-auto mb-6">
            {/* Hourglass Icon */}
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <path
                d="M16 8 L48 8 L44 12 L44 20 L32 28 L44 36 L44 44 L48 48 L16 48 L20 44 L20 36 L32 28 L20 20 L20 12 Z"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <path d="M20 44 L44 44 L44 36 L32 28 L20 36 Z" fill="#374151" />
            </svg>
          </div>
          <div className="text-gray-700 text-2xl font-bold leading-relaxed">
            AI กำลังประมวลผล
            <br />
            กรุณารอสักครู่.....
          </div>
        </div>
      </div>
    </LayoutScreen>
  );
}

export default AnalyzingScreen;
