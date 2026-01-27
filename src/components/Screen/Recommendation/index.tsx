import { AlertCircle, Thermometer, Snowflake } from "lucide-react";

interface StorageRecommendation {
  type: string;
  icon: React.ReactNode;
  items: string[];
  optimalTemp: string;
  fridgeDays: string;
  freezerMonths: string;
  spoilageSignsTitle: string;
  spoilageSignsDescription: string;
}

function RecommendationScreen() {
  const recommendations: Record<string, StorageRecommendation> = {
    pork: {
      type: "หมู",
      icon: "🐷",
      items: ["หมูสันนอก", "หมูสันใน", "หมูหมักหมู"],
      optimalTemp: "4°C (40°F) หรือต่ำกว่า",
      fridgeDays: "1-2 วัน",
      freezerMonths: "3-4 เดือน",
      spoilageSignsTitle: "สัญญาณเนื้อเสีย",
      spoilageSignsDescription:
        "เนื้อนิ่มมีกลิ่นเหม็นเหมือนซัลเฟอร์ สีจางลงเป็นสีเทา",
    },
  };

  const currentRec = recommendations.pork;

  return (
    <div className="w-full max-w-md mx-auto my-22 grid gap-3">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">วิธีเก็บรักษาเนื้อ</h1>

      {/* Subtitle */}
      <p className="text-sm text-gray-500">
        เพิ่มอายุการเก็บและลดการสูญเสียอาหารตามแนวทางของผู้เชี่ยวชาญ
      </p>

      {/* Meat Type Card */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-2 border border-gray-100">
        {/* Type Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-orange-100 p-2 rounded-[100px] w-12 h-12 flex items-center justify-center">
              {currentRec.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">
                {currentRec.type}
              </span>
              <span className="text-xs text-gray-500">
                {currentRec.items.join(", ")}
              </span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Optimal Temperature */}
        <div className="mb-6 h-20 px-5 rounded-2xl bg-gray-100 items-center flex">
          <div className="bg-blue-100 rounded-lg p-3 w-12! h-12! grid gap-5 ">
            <Thermometer className=" text-blue-600" />
          </div>
          <div className="gap-3 my-auto ml-5">
            <span className="text-sm font-semibold text-gray-800">
              อุณหภูมิที่เหมาะสม
            </span>
            <p className="text-sm text-gray-600">{currentRec.optimalTemp}</p>
          </div>
        </div>

        {/* Storage Duration */}
        <div className="flex gap-4 mb-6">
          {/* Fridge */}
          <div className="flex-1 h-20 px-5 rounded-2xl bg-gray-100 items-center flex">
            <div className="bg-blue-100 rounded-lg p-3">
              <Snowflake className="w-5 h-5 text-blue-500" />
            </div>
            <div className="gap-1 my-auto ml-4 flex flex-col">
              <span className="text-xs font-bold text-gray-700">ตู้เย็น</span>
              <p className="text-sm font-semibold text-gray-800">
                {currentRec.fridgeDays}
              </p>
            </div>
          </div>

          {/* Freezer */}
          <div className="flex-1 h-20 px-5 rounded-2xl bg-gray-100 items-center flex">
            <div className="bg-cyan-100 rounded-lg p-3">
              <Snowflake className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="gap-1 my-auto ml-4 flex flex-col">
              <span className="text-xs font-bold text-gray-700">
                ช่องแช่แข็ง
              </span>
              <p className="text-sm font-semibold text-gray-800">
                {currentRec.freezerMonths}
              </p>
            </div>
          </div>
        </div>

        {/* Spoilage Signs - Alert Box */}
        <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-700 text-sm mb-1">
                {currentRec.spoilageSignsTitle}
              </h3>
              <p className="text-xs text-red-600 leading-relaxed">
                {currentRec.spoilageSignsDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Tips */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-6">
        <h3 className="font-bold text-blue-900 text-sm mb-3">
          💡 เคล็ดลับเพิ่มเติม
        </h3>
        <ul className="text-xs text-blue-800 space-y-2">
          <li>• ใช้ภาชนะปิดสนิทเพื่อหลีกเลี่ยงการแห้งและการปนเปื้อน</li>
          <li>• เลือกเนื้อหมีบาสต่ำกว่า 10% สำหรับเนื้อบด</li>
          <li>• หลีกเลี่ยงการตั้งเนื้อนวลเข้มเพราะบ่งชี้ว่าเสื่อมสภาพ</li>
          <li>• ซื้อเนื้อในปริมาณที่กินได้ทั้งหมดในเวลา 1-2 วัน</li>
        </ul>
      </div>
    </div>
  );
}

export default RecommendationScreen;
