import { ShieldCheck, ClipboardList, Store } from "lucide-react";
import LayoutScreen from "../../Layout/LayoutScreen";
import { useAppContext } from "../../../AppContext";

function FeaturesScreen() {
  const { setCurrentScreen } = useAppContext();

  const handleStoreClick = () => {
    setCurrentScreen("map");
  };

  const handleHistoryClick = () => {
    setCurrentScreen("history");
  };

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "ตรวจสอบความสด",
      description: "ผู้ช่วยตรวจสอบความสด ของเนื้อด้วย AI อย่างแม่นยำ",
      bgColor: "bg-green-50",
      onClick: undefined,
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-primary" />,
      title: "ดูประวัติการสแกน",
      description: "เชื่อมประวัติการสแกนอย่างคงถาวง่าย",
      bgColor: "bg-green-50",
      onClick: handleHistoryClick,
    },
    {
      icon: <Store className="w-8 h-8 text-primary" />,
      title: "แนะนำร้านค้าใกล้เคียง",
      description: "แนะนำร้านค้าเคียงที่ค่าแห่นเดินต้นแดดหรือสเน",
      bgColor: "bg-green-50",
      onClick: handleStoreClick,
    },
  ];

  return (
    <LayoutScreen screen={"steps"} showNavBar={true}>
      <div className="flex flex-col h-full">
        <h1 className="text-4xl text-shadow-md font-bold text-primary mb-8 text-center">
          สดชัวร์ AI
        </h1>

        <div className="mb-6">
          <img
            src="/src/assets/logo.png"
            alt="SOD Sure Logo"
            className="mx-auto max-w-[200px]"
          />
        </div>

        <div className="space-y-4 flex-1">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={feature.onClick}
              className={`flex items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                feature.onClick ? "cursor-pointer" : ""
              }`}
            >
              <div
                className={`${feature.bgColor} rounded-2xl p-3 mr-4 flex-shrink-0`}
              >
                {feature.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-snug">
                  {feature.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutScreen>
  );
}

export default FeaturesScreen;
