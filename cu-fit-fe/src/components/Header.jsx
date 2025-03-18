import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-green-300" : "text-white";
  };

  return (
    <header className="bg-green-600 text-white py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-green-100 transition-colors"
        >
          CU Fit
        </Link>

        {/* <nav className="flex space-x-6">
          <Link
            to="/calender"
            className={`hover:text-green-100 transition-colors ${isActive(
              "/calender"
            )}`}
          >
            Calendar
          </Link>
          <Link
            to="/mealplan"
            className={`hover:text-green-100 transition-colors ${isActive(
              "/mealplan"
            )}`}
          >
            Meal Plan
          </Link>
         <Link
           to="/diet-preference"
           className={`hover:text-green-100 transition-colors ${isActive("/diet-preference")}`}
         >
           Diet Preference
         </Link>
         <Link
           to="/meal-plan-selection"
           className={`hover:text-green-100 transition-colors ${isActive("/meal-plan-selection")}`}
         >
           Meal Plan
         </Link>
         <Link
           to="/pain-injury-form"
           className={`hover:text-green-100 transition-colors ${isActive("/pain-injury-form")}`}
         >
           Pain & Injury
         </Link>
         <Link
           to="/cooking-time"
           className={`hover:text-green-100 transition-colors ${isActive("/cooking-time")}`}
         >
           Cooking Time
         </Link>
         <Link
           to="/exercise-routine"
           className={`hover:text-green-100 transition-colors ${isActive("/exercise-routine")}`}
         >
           Exercise Routine
         </Link>
         <Link
           to="/workout-equipment"
           className={`hover:text-green-100 transition-colors ${isActive("/workout-equipment")}`}
          >
           Workout Equipment
         </Link>


        </nav> */}
      </div>
    </header>
  );
};

export default Header;
