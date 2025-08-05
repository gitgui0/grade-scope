import React, { useEffect } from "react";

const Slider = ({ isDark, name, value = 3, onChange, min = 1, max = 5 }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  useEffect(() => {
    onChange(value);
  }, [name]);
  return (
    <div className="w-full">
      <input
        name={name}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => {
          if (onChange) onChange(Number(e.target.value));
        }}
        className={`w-full h-3 rounded-lg appearance-none cursor-pointer
          `}
        style={{
          background: isDark
            ? `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${percentage}%, #334155 ${percentage}%, #334155 100%)` // Tailwind slate-700
            : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #d1d5db ${percentage}%, #d1d5db 100%)`,
        }}
      />

      <div className="flex justify-between text-xs mt-2 text-gray-600 dark:text-neutral-200 font-medium select-none">
        {[...Array(max - min + 1)].map((_, i) => (
          <span key={i}>{min + i}</span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
