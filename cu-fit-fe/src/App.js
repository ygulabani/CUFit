import { Routes, Route, useLocation } from "react-router-dom";  // ❌ Remove Router from here
import GoalSelection from "./pages/GoalSelection";
import DietSelection from "./pages/DietSelection";
import DietPreference from "./pages/DietPreference";
import CookingTimeSelection from "./pages/CookingTimeSelection";
import MealPlanSelection from "./pages/MealPlanSelection";
import MealPlan from "./pages/MealPlan";
import ActivityLevelSelection from "./pages/ActivityLevelSelection";
import ExerciseRoutine from "./pages/ExerciseRoutine";
import PainAndInjuryForm from "./pages/PainAndInjuryForm";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/signup";
import Login from "./pages/login";
import BMICalculator from "./pages/Bmicalculator";
import Calender from "./pages/Calender";
import Home from "./pages/Home";
import MealAroundCampus from "./pages/MealAroundCampus";
import ExercisesList from "./pages/ExercisesList";
import WorkoutMaster from "./pages/WorkoutMaster";
import UserMealPlan from "./pages/UserMealPlan";
import UserWorkout from "./pages/UserWorkout";
import { Toaster } from "react-hot-toast";
import WorkoutEquipment from "./pages/WorkoutEquipment";
import ChatButton from "./components/ChatButton";
import ExerciseDifficulty from "./pages/ExerciseDifficulty";
import StretchingPreference from "./pages/StretchingPreference";

function App() {
  const location = useLocation();  

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/goal-selection" element={<GoalSelection />} />
        <Route path="/diet-selection" element={<DietSelection />} />
        <Route path="/diet-preference" element={<DietPreference />} />
        <Route path="/cooking-time" element={<CookingTimeSelection />} />
        <Route path="/meal-plan-selection" element={<MealPlanSelection />} />
        <Route path="/meal-plan" element={<MealPlan />} />
        <Route path="/activity-level" element={<ActivityLevelSelection />} />
        <Route path="/exercise-routine" element={<ExerciseRoutine />} />
        <Route path="/pain-injury-form" element={<PainAndInjuryForm />} />
        <Route path="/stretching-preference" element={<StretchingPreference />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bmi-calculator" element={<BMICalculator />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/meal-around-campus" element={<MealAroundCampus />} />
        <Route path="/exercises-list" element={<ExercisesList />} />
        <Route path="/exercises-master" element={<WorkoutMaster />} />
        <Route path="/user-meal-plan" element={<UserMealPlan />} />
        <Route path="/workout-equipment" element={<WorkoutEquipment />} />
        <Route path="/user-workout" element={<UserWorkout />} />
        <Route path="/exercise-difficulty" element={<ExerciseDifficulty />} />
      </Routes>

      {/* ✅ ChatButton will NOT appear on the login page */}
      {location.pathname !== "/login" &&
       location.pathname !== "/" &&
       location.pathname !== "/signup" && <ChatButton />}
    </div>
  );
}

export default App;