import {
  AlertCircle,
  Thermometer,
  Snowflake,
  PiggyBank,
  Beef,
} from "lucide-react";

interface StorageRecommendation {
  type: string;
  icon: React.ReactNode;
  iconBg: string;
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
      icon: <PiggyBank />,
      iconBg: "bg-orange-100",
      items: ["หมูสันนอก", "หมูสันใน", "หมูสามชั้น", "หมูบด", "หมูหมัก (ดิบ)"],
      optimalTemp: "0–4°C (32–40°F) หรือต่ำกว่า",
      fridgeDays: "1–2 วัน",
      freezerMonths: "4–6 เดือน",
      spoilageSignsTitle: "สัญญาณว่าเนื้อหมูเริ่มเสีย",
      spoilageSignsDescription:
        "มีกลิ่นเปรี้ยวหรือกลิ่นเหม็นผิดปกติ เนื้อมีเมือกลื่น สีเปลี่ยนเป็นเทา เขียว หรือมีจุดดำ",
    },
    beef: {
      type: "เนื้อวัว",
      icon: <Beef />,
      iconBg: "bg-red-100",
      items: ["เนื้อวัวสันนอก", "เนื้อวัวสันใน", "เนื้อวัวหมัก"],
      optimalTemp: "0–4°C (32–40°F) หรือต่ำกว่า",
      fridgeDays: "1–2 วัน",
      freezerMonths: "6–12 เดือน",
      spoilageSignsTitle: "สัญญาณว่าเนื้อวัวเริ่มเสีย",
      spoilageSignsDescription:
        "มีกลิ่นเหม็นผิดปกติ เนื้อมีเมือก สีคล้ำ เทา หรือมีจุดเขียว",
    },
  };

  return (
    <div className="w-full min-h-screen my-16 px-4">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-0 md:px-6 py-6 md:py-8 grid gap-6">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          วิธีเก็บรักษาเนื้อ
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500">
          เพิ่มอายุการเก็บและลดการสูญเสียอาหารตามแนวทางของผู้เชี่ยวชาญ
        </p>

        {/* LOOP HERE */}
        {Object.values(recommendations).map((rec, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-md p-4 md:p-6 lg:p-8 border border-gray-100"
          >
            {/* Type Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span
                  className={`text-2xl md:text-3xl p-2 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center ${rec.iconBg}`}
                >
                  {rec.icon}
                </span>
                <div>
                  <span className="text-lg md:text-xl font-semibold text-gray-800">
                    {rec.type}
                  </span>
                  <p className="text-xs md:text-sm text-gray-500">
                    {rec.items.join(", ")}
                  </p>
                </div>
              </div>

              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-white"
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
            <div className="mb-4 h-20 md:h-24 px-4 md:px-5 rounded-2xl bg-gray-100 flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <Thermometer className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <span className="text-sm md:text-base font-semibold text-gray-800">
                  อุณหภูมิที่เหมาะสม
                </span>
                <p className="text-sm md:text-base text-gray-600">
                  {rec.optimalTemp}
                </p>
              </div>
            </div>

            {/* Storage Duration */}
            <div className="flex gap-4 mb-6">
              {/* Fridge */}
              <div className="flex-1 h-20 md:h-24 px-4 md:px-5 rounded-2xl bg-gray-100 flex items-center">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Snowflake className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <span className="text-xs md:text-sm font-bold text-gray-700">
                    ตู้เย็น
                  </span>
                  <p className="text-sm md:text-base font-semibold text-gray-800">
                    {rec.fridgeDays}
                  </p>
                </div>
              </div>

              {/* Freezer */}
              <div className="flex-1 h-20 md:h-24 px-4 md:px-5 rounded-2xl bg-gray-100 flex items-center">
                <div className="bg-cyan-100 rounded-lg p-3">
                  <Snowflake className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
                </div>
                <div className="ml-4">
                  <span className="text-xs md:text-sm font-bold text-gray-700">
                    ช่องแช่แข็ง
                  </span>
                  <p className="text-sm md:text-base font-semibold text-gray-800">
                    {rec.freezerMonths}
                  </p>
                </div>
              </div>
            </div>

            {/* Spoilage Signs */}
            <div className="bg-red-50 rounded-2xl p-4 md:p-5 border border-red-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-700 text-sm md:text-base mb-1">
                    {rec.spoilageSignsTitle}
                  </h3>
                  <p className="text-xs md:text-sm text-red-600">
                    {rec.spoilageSignsDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Tips */}
        <div className="bg-blue-50 rounded-2xl p-4 md:p-5 border border-blue-200">
          <h3 className="font-bold text-blue-900 text-sm md:text-base mb-3">
            💡 เคล็ดลับเพิ่มเติม
          </h3>
          <ul className="text-xs md:text-sm text-blue-800 space-y-2">
            <li>• ใช้ภาชนะปิดสนิท ป้องกันการปนเปื้อน</li>
            <li>• แยกเนื้อดิบออกจากอาหารพร้อมกิน</li>
            <li>• หากมีกลิ่นผิดปกติ ควรทิ้งทันที</li>
            <li>• ซื้อเนื้อในปริมาณที่บริโภคได้ภายใน 1–2 วัน</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RecommendationScreen;
