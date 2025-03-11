import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
function App() {
    return (
        <Router>
            <Routes>
            
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home  />} />
                <Route path="/goal-selection" element={<GoalSelection />} />
                <Route path="/diet-selection" element={<DietSelection />} />
                <Route path="/diet-preference" element={<DietPreference />} />
                <Route path="/cooking-time" element={<CookingTimeSelection />} />
                <Route path="/meal-plan-selection" element={<MealPlanSelection />} />
                <Route path="/meal-plan" element={<MealPlan />} />
                <Route path="/activity-level" element={<ActivityLevelSelection />} />
                <Route path="/exercise-routine" element={<ExerciseRoutine />} />
                <Route path="/pain-injury-form" element={<PainAndInjuryForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bmi-calculator" element={<BMICalculator />} />
                <Route path="/calender" element={<Calender />} />
            </Routes>
        </Router>
    );
}

export default App;
