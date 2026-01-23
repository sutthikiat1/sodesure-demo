import LayoutScreen from "../../Layout/LayoutScreen";
import LOGO from "../../../assets/logo.png"; // Adjust the path as necessary

function WelcomeScreen() {
  return (
    <LayoutScreen screen={"features"}>
      <div className="text-center flex-1 gap-[24px] flex items-center justify-between flex-col">
        <h1 className="text-4xl text-shadow-md font-bold  text-primary  text-center">
          สดชัวร์ AI
        </h1>
        <img
          src={LOGO}
          alt="SOD Sure Logo"
          className="flex items-center justify-center"
        />

        <div className="text-gray-700 text-2xl leading-relaxed mb-12">
          ผู้ช่วยตรวจสอบความสด ของเนื้อด้วย AI อย่างแม่นยำ
        </div>
      </div>
    </LayoutScreen>
  );
}

export default WelcomeScreen;
