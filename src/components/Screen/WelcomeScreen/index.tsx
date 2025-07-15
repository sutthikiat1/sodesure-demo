import LayoutScreen from "../../Layout/LayoutScreen";
import LOGO from "../../../assets/logo.png"; // Adjust the path as necessary

function WelcomeScreen() {
  return (
    <LayoutScreen screen={"steps"}>
      <div className="text-center flex-1 gap-[24px] flex items-center justify-between flex-col">
        <h1 className="text-6xl font-bold  text-primary  text-center">
          Welcome...
        </h1>
        {/* SOD Sure Logo */}
        <img
          src={LOGO}
          alt="SOD Sure Logo"
          className="flex items-center justify-center"
        />

        <div className="text-gray-700  text-3xl  leading-relaxed mb-12">
          ผู้ช่วยตรวจสอบความสด
          <br />
          ของเนื้อด้วย AI อย่างแม่นยำ
        </div>
      </div>
    </LayoutScreen>
  );
}

export default WelcomeScreen;
