import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PredictPage from "./components/PredictPage";
import Home from "./components/Home";
import AboutPage from "./components/AboutPage";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  return (
    <Router>
      <div className="relative">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme={isDark ? "dark" : "light"}
        />
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        <Routes>
          <Route
            path="/"
            element={<Home isDark={isDark} setIsDark={setIsDark} />}
          />
          <Route
            path="/predict"
            element={<PredictPage isDark={isDark} setIsDark={setIsDark} />}
          />
          <Route
            path="/about"
            element={<AboutPage isDark={isDark} setIsDark={setIsDark} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
