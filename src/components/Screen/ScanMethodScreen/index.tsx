import { Camera } from "lucide-react";
import { useAppContext } from "../../../AppContext";
import LayoutScreen from "../../Layout/LayoutScreen";

function ScanMethodScreen() {
  const { fileInputRef, handleFileUpload } = useAppContext();

  return (
    <LayoutScreen screen="scan-method">
      <div className="text-center flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-primary mb-8">
          ให้สิทธิการใช้งานกล้อง
        </h1>

        <div className="text-base text-gray-700 mb-16 leading-relaxed">
          เพื่อให้สามารถสแกนและเปิดได้
          <br />
          ระบบต้องเข้าถึงกล้องของคุณ
        </div>

        <div className="">
          <div className="bg-blue-600 rounded-2xl p-8 mb-8 inline-block">
            <Camera className="w-16 h-16 text-white mx-auto" />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </LayoutScreen>
  );
}

export default ScanMethodScreen;
