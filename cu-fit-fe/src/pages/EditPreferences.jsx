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
        { name: "Cheat days", path: "/calender", icon: "📅" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Edit Your Preferences</h1>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {preferences.map((pref) => (
                        <button
                            key={pref.name}
                            onClick={() => navigate(pref.path, { state: { isEditing: true }})}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-left"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{pref.icon}</span>
                                <span className="text-gray-800 font-medium">{pref.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditPreferences; 