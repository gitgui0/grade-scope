import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import Divider from "./Divider";

const FieldData = ({
  isStepValid,
  isDark,
  username,
  setUsername,
  name,
  label,
  type = "slider",
  value,
  onChange,
  info,
  min,
  max,
  required = false,
}) => {
  const [error, setError] = useState(null);

  function hasSpecialChars(input) {
    return !/^\d+$/.test(input);
  }

  const validateValue = (val) => {
    onChange(val); // Always update parent
    if (required && (val === "" || val === null || val === undefined)) {
      setError("This field is required.");
      return false;
    }

    if (type === "number" && !isNaN(val)) {
      if (min !== undefined && val < min) {
        setError(`Minimum value is ${min}.`);
        return false;
      }
      if (max !== undefined && val > max) {
        setError(`Maximum value is ${max}.`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const renderError = () =>
    error && <p className="text-sm text-red-500 font-medium mt-1">{error}</p>;

  const labelTag = (
    <label className="block mb-1 text-lg font-semibold text-gray-900 dark:text-neutral-50">
      {label}{" "}
      {required && (
        <span className="text-red-500 dark:text-red-600 dark:text-opacity-90">
          *
        </span>
      )}
      {label === "Name" && (
        <span className="italic text-xs text-neutral-500 dark:text-neutral-400 dark:text-opacity-90 ml-1">
          Optional
        </span>
      )}
    </label>
  );

  const infoTag = info && (
    <p className="text-sm text-gray-500 dark:text-neutral-400 italic whitespace-pre-line mb-3">
      {info}
    </p>
  );

  if (type === "checkbox") {
    return (
      <div className="mb-2 sm:mb-4">
        <Divider />
        {labelTag}
        {infoTag}
        <div className="flex gap-2 mt-3">
          {["Yes", "No"].map((text, i) => {
            const val = i === 0;
            return (
              <button
                key={text}
                type="button"
                onClick={() => validateValue(val)}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200
                ${
                  value === val
                    ? "bg-blue-600 text-white border-blue-600 dark:bg-neutral-800 dark:border-neutral-500"
                    : "bg-white text-gray-800 border-gray-300 dark:border-transparent dark:bg-neutral-800 dark:text-neutral-50 hover:bg-blue-100 border"
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>
        {renderError()}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="mb-2 sm:mb-4">
        <Divider />
        {labelTag}
        {infoTag}
        <input
          type="text"
          name={name}
          value={name === "name" ? username : value || ""}
          onChange={(e) => {
            const val = e.target.value;
            name === "name" ? setUsername(val) : validateValue(val);
          }}
          onBlur={(e) => {
            const val = e.target.value;
            if (required && !val) {
              setError("This field is required.");
            }
            validateValue(val);
          }}
          className={`bg-gray-50 dark:bg-neutral-800 border ${
            error ? "border-red-500" : "border-gray-300 dark:border-neutral-700"
          } text-gray-900 dark:text-neutral-100 text-md rounded-lg block w-full p-2.5`}
          required
        />
        {renderError()}
      </div>
    );
  }

  if (type === "number") {
    return (
      <div className="mb-2 sm:mb-4">
        <Divider />
        {labelTag}
        {infoTag}
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          name={name}
          value={value ?? ""}
          min={min}
          max={max}
          onChange={(e) => {
            const val = e.target.value;

            const string = e.target.value.toString();
            // Allow empty input for erasing
            if (val === "") {
              validateValue("");
              return;
            }

            // Truncate and validate
            if (name == "age") {
              validateValue(Math.trunc(Number(val)));
            } else {
              validateValue(Number(val));
            }
          }}
          onBlur={(e) => {
            const val = e.target.value;
            if (required && !val) {
              setError("This field is required.");
            }
            validateValue(val); // Add this line to capture change
          }}
          className={`bg-gray-50 dark:bg-neutral-800 border ${
            error ? "border-red-500" : "border-gray-300 dark:border-neutral-700"
          } text-gray-900 dark:text-neutral-100 text-md rounded-lg block w-full p-2.5`}
          required
        />
        {renderError()}
      </div>
    );
  }

  // Default: slider
  return (
    <div className="mb-4 sm:mb-7 md:mb-10">
      <Divider />
      {labelTag}
      {infoTag}
      <Slider
        isDark={isDark}
        name={name}
        value={value !== undefined && value !== null ? value : min ?? 1}
        onChange={(val) => validateValue(val)}
        min={min}
        max={max}
      />
      {renderError()}
    </div>
  );
};

export default FieldData;
