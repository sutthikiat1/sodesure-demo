import Navbar from "./Navbar";
import BottomBar from "./BottomBar";
import AXONSLOGO from "../../assets/axons.svg";
import { useLocation } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = ({ children }: any) => {
  const location = useLocation();
  const isMapScreen = location.pathname === "/nearby";

  return (
    <div className="min-w-screen min-h-screen overflow-y-auto relative bg-gray-50 flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer - Powered by Axons (hidden on map screen) */}
      {!isMapScreen && (
        <div className="pb-[70px]">
          <div className="flex items-center justify-center gap-1.5 py-3 bg-gray-50 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 font-medium">
              Powered by
            </span>
            <img
              src={AXONSLOGO}
              alt="Axons"
              className="h-5 object-contain opacity-60"
            />
          </div>
        </div>
      )}

      <BottomBar />
    </div>
  );
};

export default Layout;
