import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CheckTransaction from "./pages/CheckTransaction";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/check" element={<CheckTransaction />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
