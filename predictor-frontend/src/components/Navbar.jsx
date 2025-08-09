// components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isDark, setIsDark }) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScrollY || current < 50);
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setIsDark(html.classList.contains("dark"));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-7 flex justify-center z-50 w-screen "
        >
          <div className="w-[90%] sm:w-[75%] backdrop-blur-md bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 shadow-lg rounded-3xl pl-6 pr-2 py-3 flex justify-between items-center ">
            <Link to="/" className="select-none ">
              <p
                className=" sm:hidden text-transparent text-lg font-bold bg-clip-text bg-gradient-to-r dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600"
              >
                GP
              </p>
              <p
                className="hidden sm:block text-transparent text-lg font-bold bg-clip-text bg-gradient-to-r dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600"
              >
                Grade Predictor
              </p>
            </Link>
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-16 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <Link
                to="/"
                className={`select-none hover:underline underline-offset-4 ${
                  location.pathname === "/"
                    ? "text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <p className="hidden md:block lg:text-lg">Home</p>
                <svg
                  className={`select-none md:hidden w-6 h-6  duration-200 transition-colors ${
                    location.pathname === "/"
                      ? "text-sky-500 hover:text-sky-600 dark:text-blue-400"
                      : "text-zinc-400 dark:text-zinc-100 hover:text-zinc-500"
                  } `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to="/about"
                className={`select-none hover:underline underline-offset-4 ${
                  location.pathname === "/about"
                    ? "text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <p
                  className={`hidden md:block lg:text-lg ${
                    location.pathname === "/about"
                      ? "text-blue-600 dark:text-blue-400"
                      : ""
                  }`}
                >
                  About the project
                </p>
                <svg
                  className={`select-none md:hidden w-6 h-6  duration-200 transition-colors ${
                    location.pathname === "/about"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-zinc-400 dark:text-zinc-100 hover:text-zinc-500"
                  } `}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.05 4.05A7 7 0 0 1 19 9c0 2.407-1.197 3.874-2.186 5.084l-.04.048C15.77 15.362 15 16.34 15 18a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1c0-1.612-.77-2.613-1.78-3.875l-.045-.056C6.193 12.842 5 11.352 5 9a7 7 0 0 1 2.05-4.95ZM9 21a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm1.586-13.414A2 2 0 0 1 12 7a1 1 0 1 0 0-2 4 4 0 0 0-4 4 1 1 0 0 0 2 0 2 2 0 0 1 .586-1.414Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                className="select-none text-zinc-600 hover:text-zinc-800 dark:text-white dark:hover:text-zinc-300  hover:-rotate-12 duration-300 ease-in-out transition"
              >
                {!isDark ? (
                  // Light icon
                  <svg
                    className="select-none w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 
                     6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 
                     1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 
                     12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />
                  </svg>
                ) : (
                  // Moon icon
                  <svg
                    className="select-none w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.72 9.72 0 0 1 18 
                    15.75c-5.385 0-9.75-4.365-9.75-9.75 
                    0-1.33.266-2.597.748-3.752A9.753 
                    9.753 0 0 0 3 11.25C3 16.635 7.365 
                    21 12.75 21a9.753 9.753 0 0 0 
                    9.002-5.998Z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <Link
              className="select-none bg-blue-600
               px-4 py-2 rounded-[2.5em] text-white"
              to="/predict"
            >
              Predict
            </Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
