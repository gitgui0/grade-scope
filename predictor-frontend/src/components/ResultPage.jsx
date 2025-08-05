import React, { useEffect, useState } from "react";
import Divider from "./Divider";

// Mean (average) values
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
  g1: 12,
  g2: 12,
};

const positiveIfHigher = [
  "studytime",
  "famrel",
  "freetime",
  "health",
  "famsup",
  "schoolsup",
  "g1",
  "g2",
];

const positiveIfLower = [
  "traveltime",
  "failures",
  "goout",
  "Dalc",
  "Walc",
  "absences",
];

const fieldLabels = {
  traveltime: "Commute Time",
  studytime: "Study Time",
  failures: "Failed Subjects",
  schoolsup: "School Support",
  famsup: "Family Support",
  famrel: "Family Relationship",
  freetime: "Free Time",
  goout: "Going Out",
  Dalc: "Daily Alcohol Use",
  Walc: "Weekend Alcohol Use",
  health: "Health",
  absences: "Absences",
  g1: "Grade 1",
  g2: "Grade 2",
};

// Down arrow (red), thick, filled:
const DownArrow = ({ color = "gray-800" }) => (
  <svg
    className={`w-[30px] h-[30px] text-${color} `}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="3"
      d="M12 19V5m0 14-4-4m4 4 4-4"
    />
  </svg>
);

// Up arrow (green), thick, filled:
const UpArrow = ({ color = "gray-800" }) => (
  <svg
    className={`w-[30px] h-[30px] text-${color} `}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="3"
      d="M12 6v13m0-13 4 4m-4-4-4 4"
    />
  </svg>
);

const ResultPage = ({ name = null, results, userData }) => {
  const [advancedResults, setAdvancedResults] = useState(false);


  const categorizeFactors = () => {
    const strong = [];
    const weak = [];
    const neutral = [];

    const data = userData;

    Object.entries(meanValues).forEach(([key, mean]) => {
      const userVal = data[key];

      if (userVal === undefined || userVal === null) return;

      if (typeof mean === "boolean") {
        if (userVal === mean) neutral.push(key);
        else if (userVal === true) strong.push(key);
        else weak.push(key);
      } else {
        const delta = userVal - mean;

        if (positiveIfHigher.includes(key)) {
          if (delta > 0) strong.push(key);
          else if (delta < 0) weak.push(key);
          else neutral.push(key);
        } else if (positiveIfLower.includes(key)) {
          if (delta < 0) strong.push(key);
          else if (delta > 0) weak.push(key);
          else neutral.push(key);
        } else {
          // fallback if not classified
          neutral.push(key);
        }
      }
    });

    return { strong, weak, neutral };
  };

  const { strong, weak, neutral } = categorizeFactors();

  const finalGrade = results.final

  const convertToLetterGrade = (grade) => {
    if (grade >= 19) return "A+";
    if (grade >= 18) return "A";
    if (grade >= 17) return "A−";
    if (grade >= 16) return "B+";
    if (grade >= 15) return "B";
    if (grade >= 14) return "B−";
    if (grade >= 13) return "C+";
    if (grade >= 12) return "C";
    if (grade >= 11) return "C−";
    if (grade >= 9.5) return "D";
    return "F";
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-neutral-50 dark:bg-neutral-900 shadow-md rounded-2xl p-8 flex flex-col">
      <h1 className="text-4xl font-bold text-blue-800 dark:text-white">
        Here's your results{name ? `, ${name}` : ""}!
      </h1>

      <div className="mt-6 mb-8">
        <p className="text-md font-medium text-slate-600 dark:text-neutral-400 mb-1">
          Predicted Final Grade
        </p>
        <div className="flex items-baseline gap-3">
          <span
            className={`text-4xl font-extrabold tracking-tight ${
              Math.round(results.final) < 10
                ? "text-red-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-rose-500 dark:to-red-600"
                : "text-green-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-green-400 dark:to-emerald-500"
            }`}
          >
            {finalGrade.toFixed(2)} / 20
          </span>
          <span className="text-xl font-semibold text-blue-700 dark:text-blue-400">
            ({convertToLetterGrade(results.final)})
          </span>
        </div>
      </div>

      {!advancedResults ? (
        <>
          {results?.advice &&
            results.advice !==
              "Behavioral and Academic performace are aligned. Well done!" && (
              <p className="my-1 text-slate-600 mb-3 dark:text-neutral-300">
                We've collected some advice that may be valuable to you.
                <br />
                It's included in the{" "}
                <span className="font-semibold text-slate-900 dark:text-sky-600 ">
                  deep analysis.
                </span>
              </p>
            )}
          <p
            onClick={() => setAdvancedResults(true)}
            className="text-md underline underline-offset-2 cursor-pointer text-blue-600 decoration-blue-600 dark:text-neutral-50 dark:decoration-neutral-200 hover:no-underline transition-colors duration-100"
          >
            Click here for a more detailed analysis.
          </p>
        </>
      ) : (
        <>
          <Divider />
          <h3 className="text-2xl font-bold text-blue-800 dark:text-neutral-200 mb-4">
            Deep Analysis
          </h3>

          <p className="text-lg text-gray-700 dark:text-neutral-200 mb-6 whitespace-pre-line">
            {results.advice || "No specific advice available for your profile."}
          </p>

          <div className="mb-6">
            {/* Behavior Grade */}
            <div className="mb-5">
              <p className="text-md font-medium text-slate-600 dark:text-neutral-300 mb-1">
                Behavior-Only Grade
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="text-3xl font-extrabold tracking-tight text-blue-700 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r 
              dark:from-sky-300 dark:to-blue-500
              "
                >
                  {results.behavior.toFixed(2)} / 20
                </span>
                <span className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  ({convertToLetterGrade(results.behavior)})
                </span>
              </div>
              <p className="text-md text-gray-500 dark:text-neutral-400 dark:text-opacity-80 italic">
                Based on behavioral patterns like attendance, participation, and
                lifestyle habits.
              </p>
            </div>

            {/* Performance Grade */}
            <div>
              <p className="text-md font-medium text-slate-600 dark:text-neutral-300 mb-1">
                Performance-Only Grade
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="text-3xl font-extrabold tracking-tight text-blue-700 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r 
              dark:from-sky-300 dark:to-blue-500"
                >
                  {results.performance.toFixed(2)} / 20
                </span>
                <span className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  ({convertToLetterGrade(results.performance)})
                </span>
              </div>
              <p className="text-md text-gray-500 dark:text-neutral-400 dark:text-opacity-80 italic">
                Based on academic-related data like study time and previous
                grades.
              </p>
            </div>
          </div>

          <Divider />

          <h3 className="text-2xl font-semibold text-blue-800 dark:text-neutral-50 mb-3">
            Areas to improve
          </h3>

          <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-lin mb-8">
            Everyone has areas they can improve — recognizing them is already a
            big step forward. These factors below are currently performing below
            average compared to student trends. By focusing on these, you can
            make meaningful progress not only in your academic results but also
            in your overall balance and well-being.
          </p>

          {weak.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-red-700 dark:text-neutral-100 flex items-center gap-2">
                Current Weak Points
                <DownArrow color="red-700" />
              </h4>
              <ul className="list-disc list-inside text-gray-700 mt-4">
                {weak.map((field) => (
                  <li className="text-lg dark:text-neutral-300" key={field}>
                    {fieldLabels[field] || field}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {strong.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-green-600 dark:text-neutral-100 flex items-center gap-2">
                Current Strong Points
                <UpArrow color="green-600" />
              </h4>
              <ul className="list-disc list-inside text-gray-700 mt-4">
                {strong.map((field) => (
                  <li className="text-lg dark:text-neutral-300" key={field}>
                    {fieldLabels[field] || field}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {neutral.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-neutral-100">
                Neutral Aspects
              </h4>
              <ul className="list-disc list-inside text-gray-700 mt-4">
                {neutral.map((field) => (
                  <li className="text-lg dark:text-neutral-300" key={field}>
                    {fieldLabels[field] || field}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p
            onClick={() => setAdvancedResults(false)}
            className="mt-6 text-md underline underline-offset-2 cursor-pointer text-blue-600 decoration-blue-600 dark:text-neutral-200 dark:decoration-neutral-200 hover:no-underline transition-colors duration-100"
          >
            Close deep analysis
          </p>
        </>
      )}
    </div>
  );
};

export default ResultPage;
