import React from "react";
// import { useAppContext } from "./AppContext.tsx";
// import WelcomeScreen from "./components/Screen/WelcomeScreen/index.tsx";
// import FeaturesScreen from "./components/Screen/FeaturesScreen/index.tsx";
// import StepsScreen from "./components/Screen/StepsScreen/index.tsx";
// import ScanMethodScreen from "./components/Screen/ScanMethodScreen/index.tsx";
// import AnalyzingScreen from "./components/Screen/AnalyzingScreen/index.tsx";
// import ResultScreen from "./components/Screen/ResultScreen/index.tsx";
// import MapScreen from "./components/Screen/MapScreen/index.tsx";
// import ScanHistoryScreen from "./components/Screen/ScanHistory/index.tsx";
// import BottomBar from "./components/Layout/BottomBar.tsx";
// import Navbar from "./components/Layout/Navbar.tsx";
import Home from "./components/Screen/Home/index.tsx";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";
import MapScreen from "./components/Screen/MapScreen/index.tsx";
import ScanHistoryScreen from "./components/Screen/ScanHistory/index.tsx";

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/guild" element={<Layout>guild</Layout>} />
      <Route path="/scan" element={<Layout>scan</Layout>} />
      <Route
        path="/history"
        element={
          <Layout>
            <ScanHistoryScreen />
          </Layout>
        }
      />
      <Route
        path="/nearby"
        element={
          <Layout>
            <MapScreen />
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
