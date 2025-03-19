import { useState } from "react";
import { useNavigate } from "react-router-dom";

const fitnessGoals = [
    {
        id: "weight-loss",
        name: "Lose Weight",
        icon: "⚖️",
        description: "Reduce body fat while maintaining muscle mass",
    },
    {
        id: "muscle-gain",
        name: "Build Muscle",
        icon: "💪",
        description: "Increase muscle mass and strength",
    },
    {
        id: "get-lean",
        name: "Get Lean",
        icon: "🏃",
        description: "Reduce body fat while maintaining athletic performance",
    },
    {
        id: "maintain",
        name: "Maintain Fitness",
        icon: "🎯",
        description: "Keep current physique and improve overall health",
    },
    {
        id: "strength",
        name: "Increase Strength",
        icon: "🏋️‍♂️",
        description: "Focus on power and strength gains",
    },
    {
        id: "endurance",
        name: "Build Endurance",
        icon: "🏃‍♀️",
        description: "Improve stamina and cardiovascular fitness",
    },
    {
        id: "flexibility",
        name: "Improve Flexibility",
        icon: "🧘‍♀️",
        description: "Enhance range of motion and reduce injury risk",
    },
    {
        id: "sports",
        name: "Sports Performance",
        icon: "⚽",
        description: "Enhance athletic abilities for specific sports",
    },
    {
        id: "body-recomp",
        name: "Body Recomposition",
        icon: "🔄",
        description: "Simultaneously build muscle and lose fat",
    },
    {
        id: "powerlifting",
        name: "Powerlifting",
        icon: "🏋️",
        description: "Focus on maximizing squat, bench press, and deadlift",
    },
    {
        id: "calisthenics",
        name: "Calisthenics",
        icon: "🤸‍♂️",
        description: "Master bodyweight exercises and movements",
    },
    {
        id: "general-health",
        name: "General Health",
        icon: "❤️",
        description: "Improve overall wellness and quality of life",
    },
];

const GoalSelection = () => {
    const [selectedGoals, setSelectedGoals] = useState([]);
    const navigate = useNavigate();

    const handleGoalSelect = (goalId) => {
        setSelectedGoals((prev) =>
            prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
        );
    };

    const handleNext = async () => {
        try {
            await fetch("http://localhost:8000/update-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ goal_selection: selectedGoals }),
            });
            navigate("/diet-selection");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-6">Select Your Fitness Goals</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {fitnessGoals.map((goal) => (
                        <button
                            key={goal.id}
                            onClick={() => handleGoalSelect(goal.id)}
                            className={`p-4 rounded-lg text-sm font-semibold transition-all 
                ${selectedGoals.includes(goal.id) ? "bg-green-500 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-green-100"}
              `}
                        >
                            {goal.icon} {goal.name}
                            <p className="text-xs text-gray-500">{goal.description}</p>
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    disabled={selectedGoals.length === 0}
                    className={`px-6 py-3 rounded-lg font-semibold ${selectedGoals.length > 0
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default GoalSelection;
