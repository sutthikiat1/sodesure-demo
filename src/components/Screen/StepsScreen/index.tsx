import { Camera, CheckCircle } from "lucide-react";
import LayoutScreen from "../../Layout/LayoutScreen";
import BRAIN from "../../../assets/brain.png";

function StepsScreen() {
  return (
    <LayoutScreen screen={"scan-method"}>
      <div className="px-6 py-8 flex-1 flex flex-col">
        <h1 className="text-5xl text-shadow-md  font-bold text-primary mb-12 text-center">
          เพียง 3 ขั้นตอน
        </h1>

        <div className="flex-1 flex gap-6 flex-col">
          <div className="flex items-center">
            <div className="bg-blue-primary rounded-[24px] p-3 mr-4 flex-shrink-0">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="text-gray-800 text-2xl">
              เปิดกล้องหรือเลือกภาพถ่าย
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-primary rounded-[24px] p-3 mr-4 flex-shrink-0">
              <img src={BRAIN} className="w-6 h-6" />
            </div>
            <div className="text-gray-800 text-2xl">
              ระบบ AI วิเคราะห์สี ลักษณะเนื้อ และความสด
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-primary rounded-[24px] p-3 mr-4 flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-gray-800 text-2xl">แสดงผลว่าสดหรือไม่สด</div>
          </div>
        </div>
      </div>
    </LayoutScreen>
  );
}

export default StepsScreen;
