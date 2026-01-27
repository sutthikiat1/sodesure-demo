import { Home, BookOpen, Store, Camera, History } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="w-full bg-slate-100 rounded-t-3xl shadow-2xl shadow-gray-300 fixed bottom-0 left-0 right-0 min-h-[70px] flex justify-between px-4 items-center z-50">
      <div
        onClick={() => navigate("/")}
        className={`flex flex-col gap-[2px] min-w-15 rounded-xl min-h-10 items-center p-1 cursor-pointer max-w-15
    ${isActive("/") ? "text-primary" : "text-gray-600"}
  `}
      >
        <Home
          className={`w-6 h-6 ${
            isActive("/") ? "text-primary" : "text-gray-600"
          }`}
        />
        <span className="text-xs font-medium text-center">Home</span>
      </div>

      <div
        onClick={() => navigate("/guild")}
        className={`flex flex-col gap-[2px] min-w-15 rounded-xl min-h-10 items-center p-1 cursor-pointer max-w-15
    ${isActive("/guild") ? "text-primary" : "text-gray-600"}
  `}
      >
        <BookOpen
          className={`w-6 h-6 ${
            isActive("/guild") ? "text-primary" : "text-gray-600"
          }`}
        />
        <span className="text-xs font-medium text-center">คำแนะนำ</span>
      </div>

      <div
        onClick={() => {
          navigate("/scan");
        }}
        className="flex flex-col gap-[2px] bg-primary min-w-15 rounded-xl min-h-10 items-center p-1 cursor-pointer max-w-15"
      >
        <Camera className="text-white w-6 h-6" />
        <span className="text-xs text-white font-medium text-center">Scan</span>
      </div>

      <div
        onClick={() => navigate("/history")}
        className={`flex flex-col gap-[2px] min-w-15 rounded-xl min-h-10 items-center p-1 cursor-pointer max-w-15
    ${isActive("/history") ? "text-primary" : "text-gray-600"}
  `}
      >
        <History
          className={`w-6 h-6 ${
            isActive("/history") ? "text-primary" : "text-gray-600"
          }`}
        />
        <span className="text-xs font-medium text-center">ประวัติ</span>
      </div>
      <div
        onClick={() => navigate("/nearby")}
        className={`flex flex-col gap-[2px] min-w-15 rounded-xl min-h-10 items-center p-1 cursor-pointer max-w-15
    ${isActive("/nearby") ? "text-primary" : "text-gray-600"}
  `}
      >
        <Store
          className={`w-6 h-6 ${
            isActive("/nearby") ? "text-primary" : "text-gray-600"
          }`}
        />
        <span className="text-xs font-medium text-center">ร้านใกล้ฉัน</span>
      </div>
    </div>
  );
};

export default BottomBar;
