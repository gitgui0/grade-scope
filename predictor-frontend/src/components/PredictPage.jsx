import { useEffect, useState } from "react";
import axios from "axios";

import Form from "./Form";
import ResultPage from "./ResultPage";

import { toast } from "react-toastify";

function PredictPage({ isDark }) {
  const baseString = process.env.REACT_APP_BACKEND_URL;

  const [isServerUp, setIsServerUp] = useState(false);
  const [userName, setUserName] = useState("");
  const [receivedResults, setReceivedResults] = useState(false);
  const [predictionData, setPredictionData] = useState({});
  const [userData, setUserData] = useState({});

  const [formStarted, setFormStarted] = useState(true);

  // State for each input
  const [form, setForm] = useState({
    age: 17,
    traveltime: 1,
    studytime: 4,
    failures: 0,
    schoolsup: true,
    famsup: true,
    famrel: 5,
    freetime: 2,
    goout: 1,
    Dalc: 1,
    Walc: 1,
    health: 4,
    absences: 0,
    g1: 17,
    g2: 17,
  });

  const meanValues = {
    traveltime: 2,
    studytime: 2,
    failures: 1,
    schoolsup: false,
    famsup: true,
    famrel: 4,
    freetime: 3,
    goout: 3,
    Dalc: 1,
    Walc: 2,
    health: 4,
    absences: 2,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const serverUp = async () => {
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds between retries
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
    <div className="wrapper px-10 py-40 md:px-15 lg:px-20 xl:px-40 h-full flex flex-col space-y-24 bg-neutral-50 dark:bg-neutral-950">
      <main className="px-4 sm:px-6 lg:px-8">
        {receivedResults ? (
          <>
            <ResultPage
              name={userName}
              results={predictionData}
              userData={userData}
            />
            <button onClick={() => setReceivedResults(false)}></button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-8">
            <h1 className="text-6xl text-center tracking-tight md:text-5xl font-bold text-neutral-900 dark:text-neutral-50 pl-2">
              Ready to find out your grade?
            </h1>
            <p className="text-2xl mt-10 text-center text-neutral-700 dark:text-neutral-300">
              Fill out the form below, and find out quickly.
            </p>
            <Form
              authorized={isServerUp == true}
              isDark={isDark}
              username={userName}
              setUsername={setUserName}
              closeForm={() => setReceivedResults(true)}
              setPredictionData={setPredictionData}
              setUserData={setUserData}
              formStarted={formStarted}
              setFormStarted={setFormStarted}
            />
          </div>
        )}
      </main>
      {/*
        <div className="flex flex-col items-center">
          <h1>dev tools</h1>
          <div className="flex justify-center">
            <button
              className="w-15 px-4 py-2 mx-auto dark:text-white-500 border-2 border-pink-500"
              onClick={() => setFormStarted(!formStarted)}
            >
              dev :D
            </button>
            <button
              className="w-15 px-4 py-2 mx-auto dark:text-white-500 border-2 border-pink-500"
              onClick={() => setReceivedResults(false)}
            >
              retake
            </button>
          </div>
        </div>
        */}
    </div>
  );
}

export default PredictPage;
