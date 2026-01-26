import Navbar from "./Navbar";
import BottomBar from "./BottomBar";

const Layout = ({ children }: any) => {
  return (
    <div className="min-w-screen min-h-screen overflow-y-auto relative">
      <Navbar />
      {children}
      <BottomBar />
    </div>
  );
};

export default Layout;
