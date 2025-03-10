import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Header } from "@/Components";
import AuthPage from "./pages/AuthPage/AuthPage";
import StarterPage from "./pages/StarterPage/StarterPage";
import ScannerPage from "./pages/ScannerPage/ScannerPage";
import { ProtectedRoute } from "@/Components";
import RulesPage from "./pages/RulesPage/RulesPage";

function App() {
  const isAuthenticated = localStorage.getItem("authToken") !== null;

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/starter" element={<StarterPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <ScannerPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/starter" replace />} />
        <Route path="*" element={<Navigate to="/starter" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
