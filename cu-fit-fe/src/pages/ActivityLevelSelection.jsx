import { useState } from "react";
import { useNavigate } from "react-router-dom";

const activityLevels = [
    {
        id: "sedentary",
        name: "Sedentary",
        icon: "🛋️",
        description: "Little to no exercise, desk job",
        examples: "Office work, Driving, Reading"
    },
    {
        id: "light",
        name: "Lightly Active",
        icon: "🚶",
        description: "Light exercise 1-3 days/week",
        examples: "Walking, Light housework, Golf"
    },
    {
        id: "moderate",
        name: "Moderately Active",
        icon: "🏃",
        description: "Moderate exercise 3-5 days/week",
        examples: "Jogging, Light sports, Dancing"
    },
    {
        id: "very",
        name: "Very Active",
        icon: "🏋️‍♀️",
        description: "Hard exercise 6-7 days/week",
        examples: "Running, Team sports, Gym training"
    },
    {
        id: "extra",
        name: "Extra Active",
        icon: "⚡",
        description: "Very hard exercise & physical job",
        examples: "Professional athlete, Construction work"
    },
    {
        id: "athlete",
        name: "Professional Athlete",
        icon: "🏆",
        description: "Training 2x per day",
        examples: "Competitive sports, Olympic training"
    }
];

const ActivityLevelSelection = () => {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const navigate = useNavigate();

    const handleLevelSelect = (levelId) => {
        setSelectedLevel(levelId);
    };

    const handleNext = async () => {
        if (!selectedLevel) {
            alert("Please select an activity level before proceeding.");
            return;
        }

        try {
            await fetch("http://localhost:8000/update-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ activity_level: selectedLevel }),
            });
            navigate("/workout-equipment");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        What's Your Activity Level?
                    </h1>
                    <p className="text-gray-600">
                        Choose the option that best describes your daily activity
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activityLevels.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => handleLevelSelect(level.id)}
                            className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                ${selectedLevel === level.id
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-green-200'
                                }
              `}
                        >
                            <div className="text-4xl mb-3">{level.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {level.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                {level.description}
                            </p>
                            <p className="text-xs text-gray-500 italic">
                                Examples: {level.examples}
                            </p>
                            <div className={`w-full h-1 rounded-full mt-4 ${selectedLevel === level.id ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                        </button>
                    ))}
                </div>

                {selectedLevel && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleNext}
                            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold
                hover:bg-green-600 transition-colors duration-200"
                        >
                            Continue with {activityLevels.find(l => l.id === selectedLevel)?.name}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLevelSelection;
