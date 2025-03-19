import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const timeOptions = [
  "Less than 10 minutes",
  "10 - 20 minutes",
  "20 - 30 minutes",
  "30 - 45 minutes",
  "More than 45 minutes",
];

const CookingTimeSelection = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  const handleNext = async () => {
    try {
      await fetch("http://localhost:8000/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cooking_time_preference: selectedTime,
        }),
      });
      navigate("/meal-plan-selection");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">
            Cooking Time Preference
          </h1>
          <p className="text-gray-600">How much time can you spend cooking?</p>
        </div>

        {/* Time Selection Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors
                            ${
                              selectedTime === time
                                ? "bg-green-500 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-green-100"
                            }
                            `}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={!selectedTime}
            className={`w-full py-3 rounded-lg font-semibold transition-colors
                        ${
                          selectedTime
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }
                        `}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookingTimeSelection;
