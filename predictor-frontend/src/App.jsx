import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import axios from "axios";

import PredictPage from "./components/PredictPage";
import Home from "./components/Home";
import AboutPage from "./components/AboutPage";
import Navbar from "./components/Navbar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";

function App() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const baseString = process.env.REACT_APP_BACKEND_URL;
  const [isServerUp, setIsServerUp] = useState(false);
  
  const serverUp = async () => {
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds between retries
    const baseUrl = baseString + "health";


    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.get(baseUrl, { timeout: 1500 }); // 1.5s timeout
        if (response.status === 200) {
          return true; // Server is awake
        }
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          // Timeout - likely sleeping, retry
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, retryDelay));
            continue;
          }
        }
        // For other errors or retries exhausted, break and notify
        break;
      }
    }

    toast.warning(
      "Server is currently down or sleeping. It will be up very shortly."
    );
    return false;
  };

  
  useEffect(() => {
    serverUp().then((res) => {
      setIsServerUp(res);
    });
  }, []);

  
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
            element={<Home isDark={isDark} setIsDark={setIsDark} isServerUp={isServerUp} />}
          />
          <Route
            path="/predict"
            element={<PredictPage isDark={isDark} setIsDark={setIsDark} isServerUp={isServerUp} serverUp={serverUp} />}
          />
          <Route
            path="/about"
            element={<AboutPage isDark={isDark} setIsDark={setIsDark} isServerUp={isServerUp} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
