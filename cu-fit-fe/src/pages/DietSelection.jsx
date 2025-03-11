import { useState } from "react";
import { useNavigate } from "react-router-dom";

const diets = [
    { id: "no-diet", name: "No Diet at all", icon: "🚫" },
    { id: "keto", name: "Keto", icon: "🥑" },
    { id: "fasting", name: "Intermittent Fasting", icon: "⏳" },
    { id: "gluten-free", name: "Gluten Free", icon: "🌾🚫" },
    { id: "raw-food", name: "Raw Food", icon: "🥦" },
    { id: "bulking", name: "Bulking", icon: "💪" },
];

const DietSelection = () => {
    const [selectedDiet, setSelectedDiet] = useState(null);
    const navigate = useNavigate();

    const handleNext = async () => {
        try {
            await fetch("http://localhost:8000/update-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ diet_selection: selectedDiet }),
            });
            navigate("/diet-preference");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-6">Select Your Diet Plan</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {diets.map((diet) => (
                        <button
                            key={diet.id}
                            onClick={() => setSelectedDiet(diet.id)}
                            className={`p-4 rounded-lg text-sm font-semibold transition-all 
                ${selectedDiet === diet.id ? "bg-green-500 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-green-100"}
              `}
                        >
                            {diet.icon} {diet.name}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    disabled={!selectedDiet}
                    className={`px-6 py-3 rounded-lg font-semibold ${selectedDiet ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DietSelection;
