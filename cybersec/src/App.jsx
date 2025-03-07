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

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/starter" element={<StarterPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
