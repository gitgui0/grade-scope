import React, { useState, useEffect } from "react";
import FieldData from "./FieldData";
import axios from "axios";
import { toast } from "react-toastify";


const stepConfig = [
  {
    title: "Personal & Health",
    description:
      "In this topic, we gather basic personal and health-related information.",
    fields: [
      { name: "name", label: "Name", type: "text" },
      {
        name: "age",
        label: "Age",
        type: "number",
        min: 0,
        max: 28,
        required: true,
      },
      {
        name: "health",
        label: "Describe your health quality from 1 through 5",
        type: "slider",
        min: 1,
        max: 5,
      },
      {
        name: "absences",
        label: "Describe your absences from 0 through 5",
        info: "0. 0-2 Abscences\n1. 3-6 Abscences\n2. 7-10 Abscences\n3. 11-14 Abscences\n4. 15-18 Abscences\n5. More than 18 Abscences",
        min: 0,
        max: 5,
      },
    ],
    required: ["age"],
  },
  {
    title: "Academic Info",
    fields: [
      {
        name: "studytime",
        label: "Weekly Study Time",
        info: "1. Less than 2 hours\n2. 2 to 5 hours\n3. 5 to 10 hours\n4. More than 10 hours",
        type: "slider",
        min: 1,
        max: 4,
        required: true,
      },
      {
        name: "failures",
        label: "Failures",
        info: "Number of past classes failures.\nPlease select 3, if it's 3 or more classes",
        type: "slider",
        min: 0,
        max: 3,
      },
      {
        name: "g1",
        label: "Grade 1",
        info: "Please use a 0-20 grading system.",
        type: "number",
        min: 0,
        max: 20,
        required: true,
      },
      {
        name: "g2",
        label: "Grade 2",
        info: "Please use a 0-20 grading system.",
        type: "number",
        min: 0,
        max: 20,
        required: true,
      },
    ],
    required: ["studytime", "g1", "g2"],
  },
  {
    title: "Family & Support",
    fields: [
      {
        name: "schoolsup",
        label: "Do you have any School support?",
        info: "This could be any type of support, tutoring, emotional support, etc.",
        type: "checkbox",
      },
      {
        name: "famsup",
        label: "Do you have any Family Support?",
        info: "Any type of support. This could be be from financial support to emotional support.",
        type: "checkbox",
      },
      {
        name: "famrel",
        label: "Family Relationship",
        info: "Describe your family relationship from 1 through 5. \n1 - Very bad\n 5 - Excellent",
        type: "slider",
        min: 1,
        max: 5,
      },
    ],
    required: [],
  },
  {
    title: "Lifestyle & Habits",
    fields: [
      {
        name: "traveltime",
        label: "Travel Time",
        info: "Time taken to travel to school from home.\n1 - Less than 15 minutes\n2 - 15 to 30 minutes\n3 - 30 to 60 minutes\n4 - More than 60 minutes",
        type: "slider",
        min: 1,
        max: 4,
      },
      {
        name: "freetime",
        label: "Free Time",
        info: "Free time after school.\n1 - Very little\n5 - A Lot",
        type: "slider",
        min: 1,
        max: 5,
      },
      {
        name: "goout",
        label: "Going Out",
        info: "Times you normally go out with friends/family.\n1 - None/Rarely \n5 - A Lot of times",
        type: "slider",
        min: 1,
        max: 5,
      },
      {
        name: "Dalc",
        label: "Daily Alcohol Use",
        info: "Alcohol consumption on workdays.\n1 - None\n5 - A Lot",
        type: "slider",
        min: 1,
        max: 5,
      },
      {
        name: "Walc",
        label: "Weekend Alcohol Use",
        info: "Alcohol consumption on weekends.\n1 - None\n5 - A Lot",
        type: "slider",
        min: 1,
        max: 5,
      },
    ],
    required: [],
  },
];

const Form = ({
  authorized,
  isDark,
  username,
  setUsername,
  closeForm,
  setPredictionData,
  setUserData,
  formStarted,
  setFormStarted,
}) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const currentStep = stepConfig[step];

  const [stepValid, setStepValid] = useState(false);
  const baseString = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    setStepValid(isStepValid());
  }, [formData, step]);

  const isStepValid = () => {
    const currentStep = stepConfig[step];
    return currentStep.required.every((field) => {
      const val = formData[field];
      if (val === null || val === "" || val === undefined) return false;

      // Check min/max for number fields as well
      const fieldInfo = currentStep.fields.find((f) => f.name === field);
      if (fieldInfo.type === "number") {
        if (fieldInfo.min !== undefined && val < fieldInfo.min) return false;
        if (fieldInfo.max !== undefined && val > fieldInfo.max) return false;
      }
      return true;
    });
  };

  const handleChange = (name, value) => {
    // Validate the field using stepConfig info to get min, max, required and type
    const field = currentStep.fields.find((f) => f.name === name);

    let isValid = true;
    if (field) {
      if (
        field.required &&
        (value === null || value === "" || value === undefined)
      ) {
        isValid = false;
      }
      if (field.type === "number" && typeof value === "number") {
        if (field.min !== undefined && value < field.min) isValid = false;
        if (field.max !== undefined && value > field.max) isValid = false;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    setStepValid(isValid && isStepValid());
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, stepConfig.length - 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const submitTest = async (choice = 1) => {
    let payload;

    if (choice == 1) {
      payload = {
        age: 16,
        traveltime: 4,
        studytime: 5,
        failures: 4,
        schoolsup: true,
        famsup: true,
        famrel: 5,
        freetime: 2,
        goout: 1,
        Dalc: 1,
        Walc: 3,
        health: 5,
        absences: 0,
        g1: 17,
        g2: 17,
      };
    } else if (choice == 2) {
      payload = {
        age: 17,
        traveltime: 1,
        studytime: 5,
        failures: 0,
        schoolsup: true,
        famsup: true,
        famrel: 5,
        freetime: 3,
        goout: 1,
        Dalc: 1,
        Walc: 1,
        health: 5,
        absences: 0,
        g1: 20,
        g2: 20,
      };
    } else if (choice == 3) {
      payload = {
        age: 16,
        traveltime: 1,
        studytime: 3,
        failures: 0,
        schoolsup: true,
        famsup: true,
        famrel: 5,
        freetime: 3,
        goout: 1,
        Dalc: 1,
        Walc: 1,
        health: 5,
        absences: 1,
        g1: 9,
        g2: 9,
      };
    } else if (choice == 4) {
      payload = {
        age: 16,
        traveltime: 5,
        studytime: 1,
        failures: 3,
        schoolsup: false,
        famsup: false,
        famrel: 1,
        freetime: 5,
        goout: 5,
        Dalc: 5,
        Walc: 5,
        health: 1,
        absences: 4,
        g1: 19,
        g2: 19,
      };
    } else if (choice == 5) {
      payload = {
        age: 16,
        traveltime: 1,
        studytime: 5,
        failures: 0,
        schoolsup: true,
        famsup: true,
        famrel: 5,
        freetime: 3,
        goout: 1,
        Dalc: 1,
        Walc: 1,
        health: 5,
        absences: 0,
        g1: 7,
        g2: 7,
      };
    }

    try {
      const response = await axios.post(baseString + "predict", payload);
      setPredictionData(response.data);
      setUserData(payload);
      closeForm();
    } catch (error) {
      toast.error("There was an error submitting the prediction.");
    }
  };

  const handleSubmit = async () => {
    const requiredFields = ["age", "studytime", "g1", "g2"];

    const averageDefaults = {
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

    // Check if all required fields are filled
    const missingFields = requiredFields.filter(
      (field) => formData[field] == null || formData[field] === ""
    );

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (formData["age"] < 11 || formData["age"] > 28) {
      toast.error("Age must be between 11 and 28");
    }

    // Merge with defaults (formData values override averages)
    const payload = {
      ...averageDefaults,
      ...formData,
    };

    try {
      const response = await axios.post(
        baseString + "predict",
        payload
      );

      setPredictionData(response.data);
      setUserData(payload);
      closeForm();
    } catch (error) {
      toast.error("There was an error submitting the prediction.")
    }
  };

  return (
    <div
      id="form"
      className="w-full sm:w-[90%] md:w-[80%] xl:w-[70%] mt-10 bg-white dark:bg-neutral-900 bg-opacity-40 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200 p-8"
    >
      {formStarted ? (
        <>
          <div className="flex items-center justify-between mb-8 relative">
            {/* Step Tracker */}
            {stepConfig.map((s, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center relative"
              >
                <div
                  className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-bold z-10 select-none
                ${
                  step === index
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : step > index
                    ? "bg-blue-500 dark:bg-blue-700 text-white"
                    : "bg-gray-300 dark:bg-neutral-500 text-gray-600  dark:text-neutral-200"
                }
              `}
                >
                  {index + 1}
                </div>
                <span
                  className={`hidden sm:block text-xs mt-2 text-center
                ${
                  step == index
                    ? "text-blue-600 dark:text-sky-600"
                    : step < index
                    ? "text-gray-600  dark:text-neutral-300"
                    : "text-gray-600 dark:text-sky-600"
                }
                font-medium`}
                >
                  {s.title}
                </span>
                {index !== stepConfig.length - 1 && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-300 z-0">
                    <div
                      className={`h-0.5 ${
                        step > index
                          ? "bg-blue-500 dark:bg-blue-700 "
                          : step == index
                          ? "bg-gradient-to-r from-blue-500 to-gray-100 dark:from-blue-700 dark:to-neutral-300"
                          : "bg-gray-300 dark:bg-neutral-600"
                      } absolute left-1/2 w-full transform -translate-x-1/2`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Title */}
          <h3 className="text-3xl font-bold text-blue-800 dark:text-white mb-4">
            {currentStep.title}
          </h3>

          {/* Step Description */}
          {currentStep.description && (
            <p className="text-gray-600 dark:text-neutral-300 mb-8">
              {currentStep.description}
            </p>
          )}

          {/* Step Fields */}
          <div className="space-y-6">
            {currentStep.fields.map((field) => (
              <FieldData
                isStepValid={isStepValid}
                required={field.required}
                isDark={isDark}
                username={username}
                setUsername={setUsername}
                key={field.name}
                name={field.name}
                label={field.label}
                info={field.info}
                type={field.type}
                value={formData[field.name]}
                min={field.min}
                max={field.max}
                onChange={(val) => handleChange(field.name, val)}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="text-sm px-3 sm:text-md md:px-4 lg:px-10 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:text-neutral-300 hover:dark:bg-neutral-600 dark:bg-neutral-700 transition-colors duration-200"
              >
                Back
              </button>
            ) : (
              <></>
            )}
            {!authorized && (
              <div className="flex itesm-center justify-center w-full">
                <p className="text-red-500 dark:text-red-600 text-center w-1/2 leading-tight">
                  We are sorry! Our service is currently down and we won't be
                  able to handle your information. Please refresh the page.
                </p>
              </div>
            )}
            {step < stepConfig.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!stepValid}
                className={`ml-auto text-sm sm:text-md px-6 lg:px-10 py-2 rounded-lg 
              ${
                stepValid
                  ? "bg-blue-500 dark:bg-blue-700 hover:dark:bg-blue-800 text-white hover:bg-blue-600"
                  : "bg-gray-400 dark:bg-neutral-800 text-white cursor-not-allowed"
              }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!stepValid && authorized}
                className={`ml-auto text-sm px-3 sm:text-md md:px-6 py-2 rounded-lg 
                  ${
                    stepValid
                      ? "bg-green-500 hover:bg-green-600 text-white   dark:bg-blue-700 hover:dark:bg-blue-800 dark:text-neutral-50"
                      : "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed"
                  }`}
              >
                Submit
              </button>
            )}
          </div>
          {currentStep.required.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-red-500 dark:text-red-600">
                * Required field
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setFormStarted(true)}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Start Form
            </button>
            <button
              onClick={() => submitTest(1)}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit DEV TestCase1, +perf, -beh
            </button>
            <button
              onClick={() => submitTest(2)}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit DEV TestCase2, +perf, +beh
            </button>
            <button
              onClick={() => submitTest(3)}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit DEV TestCase3, -perf, +beh
            </button>
            <button
              onClick={() => submitTest(4)}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit DEV TestCase4, ++perf, --beh
            </button>
            <button
              onClick={() => submitTest(5)}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit DEV TestCase5, --perf, ++beh
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Form;
