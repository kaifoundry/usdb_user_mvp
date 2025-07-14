import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const USDBCoin = lazy(() => import("./pages/USDBCoin"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/usdb" element={<USDBCoin />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
