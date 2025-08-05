import React from "react";

const AboutPage = () => {
  return (
    <>
      <div className="wrapper px-10 py-40 md:px-15 lg:px-20 xl:px-40 h-full flex flex-col space-y-24 bg-neutral-50 dark:bg-neutral-950">
        <div className="about-start">
          <h1 className="text-6xl text-left tracking-tight md:text-5xl font-bold text-neutral-900 dark:text-neutral-50 pl-2">
            About the Project
          </h1>
          <p className="text-2xl mt-10 text-neutral-800 dark:text-neutral-200 max-w-3xl pl-2">
            Predict Your Final Grade isn’t <span className="italic">just</span>{" "}
            a final grade calculator.
          </p>

          <div className="about-description pl-2 mt-6 space-y-5">
            <p className="text-lg mt-10 text-neutral-800 dark:text-neutral-200 max-w-3xl ">
              It's a very robust,{" "}
              <span className="text-blue-800 font-semibold  dark:text-sky-500 ">
                data-driven system
              </span>{" "}
              that uses machine learning to predict your final school grade
              based on a range of academic and behavioral factors.
            </p>

            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300 max-w-3xl ">
              At its core, the system bridges two often-separated realities: how
              you study and how you live. Most predictors focus solely on
              grades. Ours acknowledges that academic success also depends on
              your{" "}
              <span className="text-blue-800 font-semibold dark:text-sky-500">
                habits, health, support systems, and personal choices
              </span>
              . .
            </p>

            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300 max-w-3xl ">
              A low grade doesn’t always reflect a lack of <b> intelligence </b>{" "}
              — sometimes,{" "}
              <span className="italic">
                it reflects a lack of support, structure, or stability
              </span>
              .
            </p>
            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300 max-w-3xl ">
              This project aims to{" "}
              <span className="italic text-blue-800 font-semibold dark:text-sky-500">
                uncover that difference
              </span>{" "}
              .
            </p>
          </div>

          <div>
            <ul className="grid grid-cols-1 lg:grid-cols-2  p-10 pb-16 rounded-2xl dark:bg-transparent dark:shadow-none  pl-4 mt-10 gap-x-8 gap-y-5">
              <li className="flex items-center gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-black dark:text-white text-4xl select-none">
                  •
                </span>
                <span className="ml-4">
                  <p className="text-2xl text-left tracking-tight text-neutral-800 dark:text-neutral-100">
                    Powered by XGBoost — a top-tier ML model for regression
                    accuracy
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-base mt-1">
                    Academic and behavioral data are modeled using two
                    specialized regressors, combined into one hybrid result that
                    captures far more nuance than a simple average ever could.
                  </p>
                </span>
              </li>

              <li className="flex items-center gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-black dark:text-white text-4xl select-none">
                  •
                </span>
                <span className="ml-4">
                  <p className="text-2xl text-left tracking-tight text-neutral-800 dark:text-neutral-100">
                    Dynamic advice engine based on behavioral-performance
                    alignment.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-base mt-1">
                    We don’t just give you a number. We tell you why. By
                    measuring the gap between behavioral and performance
                    predictions, the system gives tailored advice: whether it’s
                    time to seek help, optimize routines, or double down on good
                    habits.
                  </p>
                </span>
              </li>

              <li className="flex items-center gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-black dark:text-white text-4xl select-none">
                  •
                </span>
                <span className="ml-4">
                  <p className="text-2xl text-left tracking-tight text-neutral-800 dark:text-neutral-100">
                    Personalized insights, not just predictions.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-base mt-1">
                    Every result is paired with feedback that adapts to your
                    situation. Whether you’re thriving or struggling, the system
                    gives context — not just a number — so you understand what’s
                    helping or holding you back.
                  </p>
                </span>
              </li>

              <li className="flex items-center gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-black dark:text-white text-4xl select-none">
                  •
                </span>
                <span className="ml-4">
                  <p className="text-2xl text-left tracking-tight text-neutral-800 dark:text-neutral-100">
                    Designed for real students, not just ideal data.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-base mt-1">
                    Whether your answers are complete or not, the model adapts.
                    By training on hundreds of real academic journeys, the
                    system understands nuance — and fills in missing context
                    without making unfair assumptions.
                  </p>
                </span>
              </li>

              <li className="flex items-center gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-black dark:text-white text-4xl select-none">
                  •
                </span>
                <span className="ml-4">
                  <p className="text-2xl text-left tracking-tight text-neutral-800 dark:text-neutral-100">
                    Real-world inspired: trained on hundreds of anonymized
                    student records.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-base mt-1">
                    Each prediction is grounded in data from real academic
                    journeys. We simulate the challenges and triumphs that
                    students actually face — making the system not just
                    technical, but empathetic.
                  </p>
                </span>
              </li>

              <li className="flex items-center gap-4 bg-white dark:bg-neutral-900 bg-opacity-40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-black dark:text-white text-4xl select-none">
                  •
                </span>
                <span className="ml-4">
                  <p className="text-2xl text-left tracking-tight text-neutral-800 dark:text-neutral-100">
                    Powered by proven tools.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-base mt-1">
                    Built with Python (Flask) and Spring Boot, and trained using
                    the XGBoost ML algorithm — this stack balances accuracy,
                    performance, and flexibility, so it's ready for both
                    learning and production.
                  </p>
                </span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-semibold mt-10 mb-4 text-neutral-900 dark:text-white px-5">
            About the Dataset
          </h2>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 px-5">
            This system was trained using a real-world dataset of Portuguese
            secondary school students. Each entry includes over{" "}
            <span className="text-blue-800 font-semibold dark:text-sky-500">
              30 unique features
            </span>
            , including test scores, study time, social behavior, family
            support, and health status. Together, these features paint a
            holistic picture of each student’s academic journey.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
