/* eslint-disable react-hooks/rules-of-hooks */
import { useAppContext } from "../../../AppContext";
import {
  ChevronRight,
  Snowflake,
  Clock,
  Thermometer,
  Package,
  Camera,
  ScanLine,
  History,
} from "lucide-react";
import type { HistoryItem } from "../../../AppContext";
import { useNavigate } from "react-router-dom";

const index = () => {
  const { scanHistory, setCurrentScreen } = useAppContext();
  const navigate = useNavigate();
  console.log(scanHistory);

  const formatDateTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    // Today
    if (diffInHours < 24 && now.getDate() === date.getDate()) {
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }
    // Yesterday
    else if (diffInHours < 48) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.getDate() === yesterday.getDate()) {
        return `Yesterday, ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`;
      }
    }

    // Other dates
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getMeatType = (index: number) => {
    const types = ["Pork Loin Cut", "Minced Pork", "Pork Belly", "Pork Chop"];
    return types[index % types.length];
  };

  const HeroSection = () => {
    const currentHour = new Date().getHours();
    const greeting =
      currentHour < 12
        ? "สวัสดีตอนเช้า"
        : currentHour < 18
        ? "สวัสดีตอนบ่าย"
        : "สวัสดีตอนเย็น";

    return (
      <div className="px-4 mb-4">
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-gray-800">
            {greeting}, <span className="text-primary">Chef</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            พร้อมที่จะตรวจสอบความสดของเนื้อแล้วหรือยัง?
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          {/* Icon and Graphics */}
          <div className="relative mb-4 flex justify-center">
            <div className="relative">
              {/* Main Circle */}
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 text-center mb-1">
            ตรวจสอบความสดของเนื้อหมู
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-500 text-center mb-4">
            AI สแกนและตรวจสอบระดับความสดได้ทันที
          </p>

          {/* Start Scan Button */}
          <button
            onClick={() => {
              navigate("/scan");
            }}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ScanLine className="w-5 h-5" />
            <span>เริ่มสแกน</span>
          </button>

          {/* Footer Note */}
          <p className="text-xs text-gray-400 text-center mt-3">
            AI คาดการณ์ • ตรวจสอบด้วยสายตาเพิ่มเติม
          </p>
        </div>
      </div>
    );
  };

  const RecentHistory = () => {
    return (
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 border-l-4 border-primary pl-3">
            ประวัติการสแกนล่าสุด
          </h2>
          {scanHistory?.length > 0 && (
            <button
              onClick={() => navigate("/history")}
              className="text-blue-500 text-sm font-semibold hover:underline"
            >
              ดูทั้งหมด
            </button>
          )}
        </div>

        {scanHistory?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              ยังไม่มีประวัติการสแกน
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              เริ่มต้นสแกนเนื้อของคุณเพื่อดูประวัติที่นี่
            </p>
            <button
              onClick={() => navigate("/scan")}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-full transition-colors text-sm"
            >
              เริ่มสแกนเลย
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {scanHistory.slice(0, 3).map((item: HistoryItem, index: number) => {
              const confidence = Math.round(item.confidence * 100);
              const bgColor =
                confidence >= 90
                  ? "bg-green-100 text-green-700"
                  : confidence >= 80
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setCurrentScreen("history")}
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt="Meat scan"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/64?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-base mb-1">
                      {getMeatType(index)}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>{formatDateTime(item.timestamp)}</span>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${bgColor}`}
                    >
                      {confidence}%
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const FreshnessTips = () => {
    const tips = [
      {
        id: 1,
        icon: Snowflake,
        title: "เก็บให้เย็น",
        description:
          "เก็บในตู้เย็นที่อุณหภูมิต่ำกว่า 4°C เพื่อป้องกันแบคทีเรีย",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-500",
      },
      {
        id: 2,
        icon: Clock,
        title: "เช็ควันหมดอายุ",
        description: "ตรวจสอบวันหมดอายุบนบรรจุภัณฑ์ทุกครั้ง",
        bgColor: "bg-red-50",
        iconColor: "text-red-500",
      },
      {
        id: 3,
        icon: Thermometer,
        title: "ปรุงให้สุก",
        description: "ปรุงให้สุกที่อุณหภูมิ 63°C เพื่อความปลอดภัย",
        bgColor: "bg-orange-50",
        iconColor: "text-orange-500",
      },
      {
        id: 4,
        icon: Package,
        title: "เก็บรักษาอย่างถูกวิธี",
        description: "ใช้ภาชนะปิดสนิทเพื่อรักษาความสดนานขึ้น",
        bgColor: "bg-green-50",
        iconColor: "text-green-500",
      },
    ];

    return (
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
          คำแนะนำการเก็บรักษา
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {tips.map((tip) => {
            const IconComponent = tip.icon;
            return (
              <div
                key={tip.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-w-[280px] flex-shrink-0 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${tip.bgColor} rounded-xl flex items-center justify-center mb-3`}
                >
                  <IconComponent className={`w-6 h-6 ${tip.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-2">
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 mt-[70px] pt-4 pb-24">
      <HeroSection />
      <FreshnessTips />
      <RecentHistory />
    </div>
  );
};

export default index;
