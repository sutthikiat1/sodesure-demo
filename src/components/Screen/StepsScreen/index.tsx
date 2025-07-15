import { Camera, CheckCircle } from "lucide-react";
import LayoutScreen from "../../Layout/LayoutScreen";

function StepsScreen() {
  return (
    <LayoutScreen screen={"scan-method"}>
      <div className="px-6 py-8 flex-1 flex flex-col">
        <h1 className="text-5xl font-bold text-primary mb-12 text-center">
          เพียง 3 ขั้นตอน
        </h1>

        <div className="flex-1 flex gap-6 flex-col">
          <div className="flex items-center">
            <div className="bg-blue-primary rounded-lg p-3 mr-4 flex-shrink-0">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="text-gray-800 text-base">
              เปิดกล้องหรือเลือกภาพถ่าย
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-primary rounded-lg p-3 mr-4 flex-shrink-0">
              <div className="w-6 h-6 text-white font-bold text-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <circle cx="7" cy="7" r="2" />
                  <circle cx="17" cy="17" r="2" />
                  <circle cx="12" cy="12" r="1" />
                  <path d="M7 17h10M17 7H7" />
                </svg>
              </div>
            </div>
            <div className="text-gray-800 text-base">
              ระบบ AI วิเคราะห์ที่ ด้วยตนเอง
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-primary rounded-lg p-3 mr-4 flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-gray-800 text-base">แสดงผลวาระสดหรือไม่สด</div>
          </div>
        </div>
      </div>
    </LayoutScreen>
  );
}

export default StepsScreen;
