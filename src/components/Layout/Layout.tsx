import Navbar from "./Navbar";
import BottomBar from "./BottomBar";
import AXONSLOGO from "../../assets/axons.svg";

const Layout = ({ children }: any) => {
  return (
    <div className="min-w-screen min-h-screen overflow-y-auto relative bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="pb-28">
        {children}
      </main>

      {/* Footer - Powered by Axons (Fixed above BottomBar) */}
      <div className="fixed bottom-[70px] left-0 right-0 z-40">
        <div className="flex items-center justify-center gap-1.5 py-2 bg-gray-50/90 backdrop-blur-sm border-t border-gray-100">
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

      <BottomBar />
    </div>
  );
};

export default Layout;
