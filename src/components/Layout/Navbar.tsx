import LOGO from "../../assets/logo-sodsurev2.png";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on map screen
  if (location.pathname === "/nearby") {
    return null;
  }

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 left-0 right-0 h-[70px] flex items-center px-4 z-50 shadow-sm">
      {/* Main Logo - Centered or Left */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-center"
      >
        <img
          src={LOGO}
          alt="SODSure Logo"
          className="h-[42px] object-contain"
        />
      </div>
    </nav>
  );
};

export default Navbar;
