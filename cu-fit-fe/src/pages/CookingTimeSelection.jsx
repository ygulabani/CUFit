﻿import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const timeOptions = [
  { 
    time: "Less than 10 minutes",
    icon: "⚡",
    description: "Quick and easy meals"
  },
  { 
    time: "10 - 20 minutes",
    icon: "⏱️",
    description: "Moderate preparation time"
  },
  { 
    time: "20 - 30 minutes",
    icon: "⏰",
    description: "Balanced cooking time"
  },
  { 
    time: "30 - 45 minutes",
    icon: "🍳",
    description: "More elaborate meals"
  },
  { 
    time: "More than 45 minutes",
    icon: "👨‍🍳",
    description: "Gourmet cooking experience"
  },
];

const CookingTimeSelection = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.isEditing || false;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // If editing, fetch current cooking time preference
    if (isEditing) {
      const fetchCurrentPreference = async () => {
        try {
          const response = await fetch("http://localhost:8000/workout/get-profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
          const data = await response.json();
          if (data.cooking_time_preference) {
            setSelectedTime(data.cooking_time_preference);
          }
        } catch (error) {
          console.error("Error fetching cooking time preference:", error);
          toast.error("Failed to fetch current cooking time preference");
        }
      };
      fetchCurrentPreference();
    }
  }, [navigate, isEditing]);

  const handleNext = async () => {
    if (!selectedTime) {
      toast.error("Please select a cooking time preference");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cooking_time_preference: selectedTime,
        }),
      });

      if (response.ok) {
        toast.success("Cooking time preference saved successfully!");
        if (isEditing) {
          navigate("/edit-preferences");
        } else {
          navigate("/meal-plan");
        }
      } else {
        toast.error("Failed to save cooking time preference. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save cooking time preference");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 md:p-8">
      <div className="h-full max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8 md:p-10 relative">
            <button 
              onClick={() => isEditing ? navigate("/edit-preferences") : navigate(-1)}
              className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-800/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2 tracking-tight">Cooking Time Preference</h2>
            <p className="text-green-50 text-center text-sm sm:text-base md:text-lg">How much time can you spend cooking?</p>
          </div>

          {/* Time Options */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeOptions.map((option) => (
                <button
                  key={option.time}
                  onClick={() => setSelectedTime(option.time)}
                  className={`relative group p-4 rounded-xl transition-all duration-500 hover:scale-[1.02] ${
                    selectedTime === option.time
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl shadow-green-100/50"
                      : "bg-white/50 hover:bg-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl sm:text-4xl p-3 rounded-xl transition-all duration-300 ${
                      selectedTime === option.time
                        ? "bg-gradient-to-br from-green-100 to-emerald-100 shadow-inner transform scale-110"
                        : "bg-white group-hover:scale-110 shadow-lg"
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base sm:text-lg font-semibold mb-1 transition-colors duration-300 ${
                        selectedTime === option.time ? "text-green-700" : "text-gray-800"
                      }`}>
                        {option.time}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                        selectedTime === option.time ? "text-green-600" : "text-gray-500"
                      }`}>
                        {option.description}
                      </p>
                    </div>
                    {selectedTime === option.time && (
                      <div className="absolute top-3 right-3 opacity-0 scale-90 animate-[fadeIn_0.3s_ease-out_forwards]">
                        <div className="bg-green-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                className={`group relative px-8 py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 transform ${
                  !selectedTime || loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-2xl hover:shadow-green-200 hover:scale-[1.02]"
                }`}
                onClick={handleNext}
                disabled={!selectedTime || loading}
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isEditing ? "Save Changes" : "Continue"}
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingTimeSelection;
