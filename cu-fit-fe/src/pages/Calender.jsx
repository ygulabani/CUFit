import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-hot-toast";

// Custom styles for the calendar
const StyledCalendar = styled(Calendar)`
  width: 100% !important;
  border: none !important;
  background: transparent !important;
  font-family: system-ui, -apple-system, sans-serif;

  /* Navigation section */
  .react-calendar__navigation {
    margin-bottom: 20px;
    height: 44px !important;

    button {
      min-width: 44px;
      background: none;
      font-size: 16px;
      color: #374151;
      
      &:enabled:hover,
      &:enabled:focus {
        background-color: rgba(16, 185, 129, 0.1) !important;
        border-radius: 8px;
      }

      &:disabled {
        background-color: transparent !important;
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .react-calendar__navigation__label {
      font-weight: 600;
      font-size: 18px;
      color: #10b981;
    }
  }

  /* Month view */
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 12px;
    color: #6b7280;
    
    abbr {
      text-decoration: none;
      border: none;
    }
  }

  /* Day tiles */
  .react-calendar__tile {
    padding: 12px 8px;
    background: none;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
    color: #374151;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:enabled:hover,
    &:enabled:focus {
      background-color: rgba(16, 185, 129, 0.1) !important;
      color: #10b981;
    }

    &--now {
      background-color: rgba(16, 185, 129, 0.1) !important;
      color: #10b981;
      font-weight: 600;
    }

    &--active,
    &.selected-date {
      background: linear-gradient(to right, #10b981, #059669) !important;
      color: white !important;
      font-weight: 600;
      box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.1), 0 2px 4px -1px rgba(16, 185, 129, 0.06);
      
      &:enabled:hover,
      &:enabled:focus {
        background: linear-gradient(to right, #059669, #047857) !important;
        color: white !important;
      }
    }

    &--hasActive {
      background: none;
    }

    &:disabled {
      background-color: transparent !important;
      color: #9ca3af;
      cursor: not-allowed;
    }
  }

  /* Weekend days */
  .react-calendar__month-view__days__day--weekend {
    color: #ef4444;
  }

  /* Neighboring month days */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #9ca3af;
  }
`;

const CalendarPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.isEditing || false;
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // If editing, fetch current rest days
    if (isEditing) {
      const fetchCurrentData = async () => {
        try {
          const response = await fetch("http://localhost:8000/workout/get-profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
          const data = await response.json();
          if (data.rest_days) {
            // Parse the rest days from the string
            const restDays = data.rest_days.split(",").filter(day => day.trim() !== "");
            if (restDays.length > 0) {
              setSelectedDates(restDays.map(day => new Date(day)));
            }
          }
        } catch (error) {
          console.error("Error fetching rest days:", error);
          toast.error("Failed to fetch current rest days");
        }
      };
      fetchCurrentData();
    }
  }, [navigate, isEditing]);

  const handleDateClick = (date) => {
    if (
      selectedDates.some(
        (selectedDate) => selectedDate.toDateString() === date.toDateString()
      )
    ) {
      // If date is already selected, remove it
      setSelectedDates(
        selectedDates.filter(
          (selectedDate) => selectedDate.toDateString() !== date.toDateString()
        )
      );
    } else if (selectedDates.length < 4) {
      // Add new date if less than 4 dates are selected
      setSelectedDates([...selectedDates, date]);
    } else {
      toast.error("You can only select up to 4 rest days!");
    }
  };

  const tileClassName = ({ date }) => {
    if (
      selectedDates.some(
        (selectedDate) => selectedDate.toDateString() === date.toDateString()
      )
    ) {
      return "selected-date";
    }
    return null;
  };

  const handleReset = () => {
    setSelectedDates([]);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rest_days: selectedDates.map(date => date.toISOString().split('T')[0]).join(",") }),
      });
      if (response.ok) {
        toast.success("Rest days saved successfully!");
        if (isEditing) {
          navigate("/edit-preferences");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Failed to save rest days. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to save rest days. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8 md:p-10 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-800/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2 tracking-tight">
              Rest Days Calendar
            </h2>
            <p className="text-green-50 text-center text-sm sm:text-base md:text-lg">
              Choose up to 4 days when you want to take a break
            </p>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
              <StyledCalendar
                onChange={handleDateClick}
                value={null}
                tileClassName={tileClassName}
                minDate={new Date()}
                formatShortWeekday={(locale, date) => 
                  date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)
                }
              />
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Selected Rest Days ({selectedDates.length}/4)
              </h3>
              <div className="space-y-2">
                {selectedDates.map((date, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl flex items-center justify-between group hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-gray-700 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {date.toLocaleDateString("en-US", {
                        weekday: 'short',
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => handleDateClick(date)}
                      className="text-red-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedDates.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No rest days selected yet. Click on dates to select your rest days.
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleReset}
                  disabled={selectedDates.length === 0}
                  className={`flex-1 px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2
                    ${selectedDates.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-200"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Reset Dates
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={selectedDates.length === 0 || loading}
                  className={`flex-1 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    loading || selectedDates.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-200"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isEditing ? "Save Changes" : "Confirm Days"}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
