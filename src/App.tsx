// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./layout/Layout";
import StorePage from "./pages/StorePage";
import SkuPage from "./pages/SkuPage";
import PlanningPage from "./pages/PlanningPage";
import ChartPage from "./pages/Chartpage";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route for authentication */}
        <Route path="/auth" element={<LandingPage />} />
        
        {/* Protected routes: only accessible if authenticated */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="stores" element={<StorePage />} />
          <Route path="sku" element={<SkuPage />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="charts" element={<ChartPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
