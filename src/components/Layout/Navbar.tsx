import LOGO from "../../assets/logo.png"; // Adjust the path as necessary
import AXONSLOGO from "../../assets/axons.svg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-slate-100 shadow-2xl shadow-gray-300 fixed top-0 left-0 right-0 min-h-[70px] justify-between flex px-4 items-center gap-4 z-50">
      <img
        onClick={() => {
          navigate("/");
        }}
        src={LOGO}
        alt=""
        className="w-fit h-[50px] cursor-pointer"
      />
      <img src={AXONSLOGO} alt="" className="w-fit h-[55px]" />
    </div>
  );
};

export default Navbar;
