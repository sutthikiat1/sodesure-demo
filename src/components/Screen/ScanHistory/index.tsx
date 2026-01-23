import { ArrowLeft, Calendar, Trash2, Trash } from "lucide-react";
import { useAppContext } from "../../../AppContext";
import type { HistoryItem } from "../../../AppContext";

function ScanHistoryScreen() {
  const { setCurrentScreen, scanHistory, deleteScanHistory, clearAllHistory } =
    useAppContext();

  console.log("📜 Current Scan History:", scanHistory);
  console.log("📊 History length:", scanHistory.length);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("คุณต้องการลบประวัติการสแกนนี้หรือไม่?")) {
      deleteScanHistory(id);
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        `คุณต้องการลบประวัติการสแกนทั้งหมด ${scanHistory.length} รายการหรือไม่?`
      )
    ) {
      clearAllHistory();
    }
  };

  return (
    <div className="min-h-screen max-w-[500px] mx-auto bg-white flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setCurrentScreen("features")}
            className="mr-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">ประวัติการสแกน</h1>
        </div>
        {scanHistory.length > 0 && (
          <button
            onClick={handleClearAll}
            className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
            title="ลบทั้งหมด"
          >
            <Trash className="w-5 h-5" />
            <span className="text-sm">ลบทั้งหมด</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
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
          <>
            <div className="mb-4 text-gray-600 text-sm">
              ทั้งหมด {scanHistory.length} รายการ
            </div>
            <div className="space-y-4 h-32!">
              {scanHistory.map((item: HistoryItem) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow "
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="w-32 h-36 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt="Scanned meat"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("❌ Image load error:", item.id);
                          e.currentTarget.src =
                            "https://via.placeholder.com/128?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 flex flex-col justify-between h-36 ">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.result === "fresh"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.result === "fresh" ? "มีความสด" : "ไม่สด"}
                          </span>
                          <span className="text-sm text-gray-600">
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="text-sm text-gray-500 mb-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(item.timestamp)}
                        </div>

                        <div className="text-sm text-gray-500">
                          เวลา {formatTime(item.timestamp)} น.
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="self-end mt-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ScanHistoryScreen;
