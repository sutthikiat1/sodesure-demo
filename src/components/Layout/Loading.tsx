import { createGlobalStyle } from "styled-components";
import logo from "../../assets/logo.png";

const Loading = () => {
  return (
    <>
      <StyledGlobalLoading />
      <div className="sod-scanner">
        <img src={logo} alt="SOD Sure Logo" />
        <div className="scan-line"></div>
      </div>
    </>
  );
};

const StyledGlobalLoading = createGlobalStyle`
.sod-scanner {
    position: relative;
    width: 280px; /* ปรับขนาดตามต้องการ */
    height: auto;
    overflow: hidden; /* บังส่วนที่เกินขอบ */
    display: inline-block;
  }

  .sod-scanner img {
    width: 100%;
    display: block;
    /* ทำให้ภาพจางลงเล็กน้อยตอนโหลด เพื่อให้เห็นแสงสแกนชัดขึ้น */
    opacity: 0.8; 
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(14, 80, 48, 0.1) 40%,
      rgba(14, 80, 48, 0.8) 50%,
      rgba(14, 80, 48, 0.1) 60%,
      transparent 100%
    );
    background-size: 100% 200%;
    animation: scanning 1.5s linear infinite;
  }

  @keyframes scanning {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
`;

export default Loading;
