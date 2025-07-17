import { Camera } from "lucide-react";
import { useAppContext } from "../../../AppContext";
import LayoutScreen from "../../Layout/LayoutScreen";

function ScanMethodScreen() {
  const { fileInputRef, handleFileUpload } = useAppContext();

  return (
    <LayoutScreen screen="scan-method">
      <div className="text-center flex-1 flex flex-col justify-center">
        <h1 className="text-5xl text-shadow-md  font-bold text-primary mb-8">
          ให้สิทธิการใช้งานกล้อง
        </h1>

        <div className="text-2xl text-gray-700 mb-16 leading-relaxed">
          เพื่อให้สามารถสแกนและเปิดได้
          <br />
          ระบบต้องเข้าถึงกล้องของคุณ
        </div>

        <div className="">
          <div className="bg-blue-primary rounded-[24px] p-8 mb-8 inline-block">
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
