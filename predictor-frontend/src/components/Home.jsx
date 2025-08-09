import React from "react";
import Divider from "./Divider";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="wrapper px-5 py-40 sm:px-10  md:px-15 lg:px-20 xl:px-40 h-full flex flex-col space-y-12 md:space-y-24 bg-neutral-50 dark:bg-neutral-950 *:transitions-colors *:duration-300  transition-colors duration-300">
      <div className="hero-section mx-0 sm:mx-5 sm:mb-10 pb-10 border-b border-neutral-300 dark:border-zinc-800 md:mx-16 lg:mx-26 xl:mx-52 flex flex-col items-center ">
        <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-center text-neutral-900 dark:text-neutral-50">
          Predict Your Final School Grade{" "}
          <span
            className="text-transparent text-4xl md:text-6xl font-bold bg-clip-text bg-gradient-to-r dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600"
          >
            Precisely
          </span>
        </h1>
        <p className="font-[450] text-lg sm:text-xl md:text-2xl text-center mt-14 text-gray-700 dark:text-neutral-300">
          Get a fast and accurate estimate of your final school grade — powered
          by real academic and behavioral data.
        </p>

        <p className=" italic font text-base sm:text-md nd:text-lg text-center mt-8 mb-7 md:mb-14 text-zinc-500 dark:text-neutral-400 dark:text-opacity-80">
          Built by students, for students.
        </p>
        <div className="buttons mt-4 sm:px-4 w-full flex items-center justify-center  gap-2 sm:gap-4 md:gap-6">
          <Link to="/predict">
            <button
              className=" select-none group py-3 px-5 sm:py-6 sm:px-8 rounded-[2.5em]  bg-gradient-to-r  
              from-sky-400 to-purple-600 dark:from-neutral-50 dark:to-neutral-100 hover:scale-105 transition-all duration-300 ease-out"
            >
              <p className="text-md text-center  sm:text-lg font-bold text-white dark:text-neutral-950 ">
                Predict{" "}
                <span className=" hidden sm:inline text-center  sm:text-lg font-bold text-white dark:text-neutral-950">
                  your
                </span>{" "}
                grade
              </p>
            </button>
          </Link>

          <a
            href="#how"
            className="select-none text-center py-3 px-5 sm:py-6 sm:px-8  rounded-[2.5em] bg-neutral-100 border border-opacity-60  border-neutral-300  outline-0 outline-blue-700 hover:outline-2 hover:shadow-sm
            hover:scale-105 
          dark:bg-neutral-900  dark:border-opacity-20  dark:hover:border-opacity-50 dark:border-neutral-50  transition-all duration-300 ease-out"
          >
            <p className=" text-md sm:text-lg font-normal dark:text-white text-neutral-800 ">
              What do i need?
            </p>
          </a>
        </div>
      </div>
      <div
        id="how"
        className="how pt-5 sm:pt-10 sm:mx-2 md:mx-8 lg:mx-12 xl:mx-24 flex flex-col justify-center space-y-2 sm:space-y-4 md:space-y-10"
      >
        <div className="how-start">
          <h1 className="text-3xl md:text-5xl text-left tracking-tight  font-bold text-neutral-900 pl-2 dark:text-neutral-50">
            All the steps you'll need
          </h1>
        </div>

        <div
          className="steps flex flex-col xl:grid xl:grid-cols-2 xl:space-y-0 xl:gap-6 space-y-8 
         py-6  sm:pb-16"
        >
          {/*STEP 1 */}
          <div className="how-step1 xl:my-0 gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 xl:p-7 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow ">
            <h1 className="mb-5 sm:mb-7 md:mb-10 font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-50">
              <span
                className="select-none inline-flex justify-center
                 items-center bg-gradient-to-r dark:from-sky-700 dark:to-blue-900
              from-sky-300 to-purple-400 text-white rounded-full m-0 w-10 h-10 sm:w-16 sm:h-16 text-center mr-4"
              >
                <p className="m-0 p-0 font-bold">1</p>
              </span>
              First Step
            </h1>
            <p className=" text-md sm:text-lg text-neutral-700 dark:text-neutral-100 mt-2">
              Start by filling out a short form with questions about your{" "}
              <span
                className="underline underline-offset-2 text-transparent bg-clip-text bg-gradient-to-r 
              dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600"
              >
                your academic performance and personal habits.
              </span>{" "}
              No personal data is collected, and everything stays completely{" "}
              <span
                className="underline underline-offset-2 text-transparent bg-clip-text bg-gradient-to-r 
              dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600"
              >
                private
              </span>
              .
            </p>
          </div>
          {/*STEP 2 */}
          <div className="how-step2 xl:my-0 gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 xl:p-7 p-5  rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow ">
            <h1 className="mb-5 sm:mb-7 md:mb-10 font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-50">
              <span
                className="select-none inline-flex justify-center
                 items-center bg-gradient-to-r dark:from-sky-700 dark:to-blue-900
              from-sky-300 to-purple-400 text-white rounded-full m-0  w-10 h-10 sm:w-16 sm:h-16 text-center mr-4"
              >
                <p className="m-0 p-0 font-bold">2</p>
              </span>
              Second Step
            </h1>
            <p className=" text-md sm:text-lg text-neutral-700 dark:text-neutral-100 mt-2">
              A machine learning model ,{" "}
              <span
                className="underline underline-offset-2 text-transparent bg-clip-text bg-gradient-to-r 
              dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600"
              >
                trained on real student data
              </span>{" "}
              analyzes your responses to uncover your academic strengths and
              areas for improvement.
            </p>
          </div>
          {/*STEP 3 */}
          <div className="how-step3 xl:my-0 gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 xl:p-7 p-5  rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow ">
            <h1 className="mb-5 sm:mb-7 md:mb-10 font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-50">
              <span
                className="select-none inline-flex justify-center
                 items-center bg-gradient-to-r dark:from-sky-700 dark:to-blue-900
              from-sky-300 to-purple-400 text-white rounded-full m-0  w-10 h-10 sm:w-16 sm:h-16 text-center mr-4"
              >
                <p className="m-0 p-0 font-bold">3</p>
              </span>
              Final Step
            </h1>
            <p className=" text-md sm:text-lg text-neutral-700 dark:text-neutral-100 mt-2">
              Get your{" "}
              <span
                className="underline underline-offset-2 text-transparent bg-clip-text bg-gradient-to-r 
              dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600"
              >
                predicted final rade
              </span>{" "}
              , along with a breakdown of what’s working — and what could use
              improvement. You’ll also receive{" "}
              <span
                className="underline underline-offset-2 text-transparent bg-clip-text bg-gradient-to-r 
              dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600"
              >
                suggestions
              </span>{" "}
              to help you boost your academic performance.
            </p>
          </div>
        </div>
      </div>
      <div className="why  sm:my-10 md:my-20 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-24 space-y-10">
        <div className="why-start">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50">
            Why use it?
          </h2>

          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 mt-7 sm:mt-10">
            {[
              "Fast and anonymous",
              "Built using real student data",
              "Insightful advice",
              "Distinction between academic and behavioral impact",
              "Powered by a trained ML model",
              "For students by students",
            ].map((point, i, arr) => (
              <li
                key={i}
                className={
                  `flex items-center  bg-white dark:bg-neutral-900 bg-opacity-40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow last-child-gradient-border` +
                  (i === arr.length - 1 ? " list-item" : "")
                }
              >
                <div className="text-blue-600 dark:text-blue-400 text-2xl leading-none select-none mr-2 sm:mr-4">
                  •
                </div>
                <p className="text-lg text-neutral-800 dark:text-neutral-100 leading-snug">
                  {point}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="about mx-4 md:mx-8 lg:mx-16 xl:mx-24 space-y-7">
        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-50">
          About the project
        </h2>
        <p className="text-lg md:text-xl dark:text-neutral-50">
          This project combines real-world educational data with machine
          learning to deliver meaningful grade predictions and performance
          insights for students.
        </p>

        <p className="text-lg md:text-xl  dark:text-neutral-50">
          Curious about how it all works{" "}
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r 
              dark:from-sky-400 dark:to-blue-600
              from-sky-400 to-purple-600 italic"
          >
            under the hood?
          </span>
        </p>
        <Link to="/about">
          <button
            className="text-center mt-10 py-2 px-5 rounded-lg bg-neutral-100 border border-opacity-60  border-neutral-300  outline-0 outline-blue-700 hover:outline-2 hover:shadow-sm
          hover:scale-105 
          dark:bg-neutral-900  dark:border-opacity-20  dark:hover:border-opacity-50 dark:border-neutral-50  transition-all duration-300 ease-out"
          >
            <p className="text-lg font-normal dark:text-white text-neutral-800 ">
              Learn more about the project
            </p>
          </button>
        </Link>
      </div>
      <div className="cta  mx-4 md:mx-8 lg:mx-16 xl:mx-24 space-y-10">
        <h2 className="text-3xl md:text-5xl mb-10 md:text-5xl font-bold text-neutral-900 dark:text-neutral-50">
          Ready to find out your potential?
        </h2>
        <Link to="/predict">
          <button
            className="group py-3 px-8 rounded-2xl  bg-gradient-to-r  
          from-sky-400 to-purple-600 dark:from-neutral-50 dark:to-neutral-100  transition-all duration-300 ease-out"
          >
            <p className="text-md text-center sm:text-lg font-bold text-white dark:text-neutral-950 ">
              Start Your Prediction Now
            </p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
