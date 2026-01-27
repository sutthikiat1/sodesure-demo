import { Calendar, Trash2, Trash } from "lucide-react";
import { useAppContext } from "../../../AppContext";
import type { HistoryItem } from "../../../AppContext";

function ScanHistoryScreen() {
  const { setCurrentScreen, scanHistory, deleteScanHistory, clearAllHistory } =
    useAppContext();

  console.log("📜 Current Scan History:", scanHistory);
  console.log("📊 History length:", scanHistory.length);

  const getDateSection = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    const todayOnly = new Date(today);
    todayOnly.setHours(0, 0, 0, 0);
    const yesterdayOnly = new Date(yesterday);
    yesterdayOnly.setHours(0, 0, 0, 0);

    if (dateOnly.getTime() === todayOnly.getTime()) return "TODAY";
    if (dateOnly.getTime() === yesterdayOnly.getTime()) return "YESTERDAY";
    if (dateOnly > weekAgo) return "LAST WEEK";
    return "OLDER";
  };

  const groupedHistory = scanHistory.reduce(
    (acc, item) => {
      const section = getDateSection(item.timestamp);
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );

  const sectionOrder = ["TODAY", "YESTERDAY", "LAST WEEK", "OLDER"];
  const orderedSections = sectionOrder.filter((s) => groupedHistory[s]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getProductName = (_item: HistoryItem) => {
    return "Meat Product";
  };

  const getStatusColor = (result: string) => {
    if (result === "fresh") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusText = (result: string) => {
    if (result === "fresh") return "สด";
    return "ไม่สด";
  };

  const handleDelete = (id: string) => {
    if (window.confirm("คุณต้องการลบประวัติการสแกนนี้หรือไม่?")) {
      deleteScanHistory(id);
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        `คุณต้องการลบประวัติการสแกนทั้งหมด ${scanHistory.length} รายการหรือไม่?`,
      )
    ) {
      clearAllHistory();
    }
  };

  return (
    <div className="min-h-screen max-w-[500px] mx-auto bg-gray-50 flex flex-col mt-18">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {scanHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <Calendar className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              ยังไม่มีประวัติการสแกน
            </h2>
            <p className="text-gray-500 mb-6">
              เริ่มสแกนเนื้อของคุณเพื่อดูประวัติที่นี่
            </p>
            <button
              onClick={() => setCurrentScreen("welcome")}
              className="bg-primary text-white px-6 py-3 rounded-[24px] font-medium hover:bg-primary/90 transition-colors"
            >
              เริ่มสแกน
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                ประวัติการสแกน
              </h2>
              <button
                onClick={handleClearAll}
                className="flex items-center text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash className="w-4 h-4 mr-1" />
                ลบทั้งหมด
              </button>
            </div>
            {orderedSections.map((section) => (
              <div key={section}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  {section}
                </h3>
                <div className="space-y-3">
                  {groupedHistory[section].map((item: HistoryItem) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex items-center gap-3 px-4 py-3 group"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden relative">
                        <img
                          src={item.imageUrl}
                          alt="Scanned meat"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("❌ Image load error:", item.id);
                            e.currentTarget.src =
                              "https://via.placeholder.com/80?text=No+Image";
                          }}
                        />
                        <div
                          className={`absolute top-1 left-1 px-2 py-0.5 rounded-lg text-xs font-bold shadow-sm ${
                            item.result === "fresh"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {(item.confidence * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800">
                            {getProductName(item)}
                          </h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.result === "fresh"
                            ? "Purchased fresh"
                            : "Needs attention"}
                        </p>
                        <div
                          className={`border inline-block px-3 text-sm rounded-full ${getStatusColor(
                            item.result,
                          )}`}
                        >
                          {getStatusText(item.result)}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScanHistoryScreen;
