import React from "react";

const GlobalLoading = ({ message = "Loading...", label, visible = true }) => {
  const text = label || message;
  return (
    <div
      className={`fixed inset-0 z-1000 flex items-center justify-center pointer-events-auto transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/20 pointer-events-auto transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative bg-white/95 rounded-lg p-4 shadow-lg flex items-center gap-3 z-50 transform transition-all duration-200 ${
          visible ? "scale-100" : "scale-95"
        }`}
      >
        <svg
          className="animate-spin -ml-1 mr-2 h-6 w-6 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <div className="text-sm text-gray-800">{text}</div>
      </div>
    </div>
  );
};

export default GlobalLoading;
