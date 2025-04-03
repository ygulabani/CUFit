import React from "react";
import { useNavigate } from "react-router-dom";

const EditPreferences = () => {
    const navigate = useNavigate();

    const preferences = [
        { name: "BMI Calculator", path: "/bmi-calculator", icon: "⚖️" },
        { name: "Goal Selection", path: "/goal-selection", icon: "🎯" },
        { name: "Diet Selection", path: "/diet-selection", icon: "🥗" },
        { name: "Diet Preference", path: "/diet-preference", icon: "🥑" },
        { name: "Cooking Time", path: "/cooking-time", icon: "⏲️" },
        { name: "Meal Plan", path: "/meal-plan", icon: "📋" },
        { name: "Activity Level", path: "/activity-level", icon: "🏃" },
        { name: "Exercise Difficulty", path: "/exercise-difficulty", icon: "💪" },
        { name: "Workout Equipment", path: "/workout-equipment", icon: "🏋️" },
        { name: "Exercise Routine", path: "/exercise-routine", icon: "🎽" },
        { name: "Pain & Injury", path: "/pain-injury-form", icon: "🤕" },
        { name: "Rest Days", path: "/calender", icon: "📅" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Preferences</h1>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                        >
                            <span className="text-xl group-hover:rotate-12 transition-transform duration-300">🏠</span>
                            Back
                        </button>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {preferences.map((pref) => (
                            <button
                                key={pref.name}
                                onClick={() => navigate(pref.path, { state: { isEditing: true }})}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                        {pref.icon}
                                    </span>
                                    <span className="text-gray-900 font-medium group-hover:text-emerald-700 transition-colors">
                                        {pref.name}
                                    </span>
                                </div>
                                <svg 
                                    className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all duration-300" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPreferences; 