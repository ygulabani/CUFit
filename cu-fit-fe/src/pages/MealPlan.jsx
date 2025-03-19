import { useState } from "react";
import { useNavigate } from "react-router-dom";

const meals = [
    { id: "breakfast", name: "Breakfast", icon: "🌅" },
    { id: "lunch", name: "Lunch", icon: "🥗" },
    { id: "snack", name: "Snack", icon: "🍎" },
    { id: "dinner", name: "Dinner", icon: "🍽️" },
];

const MealPlan = () => {
    const [selectedMeals, setSelectedMeals] = useState([]);
    const navigate = useNavigate();

    const handleMealSelection = (mealId) => {
        setSelectedMeals((prev) =>
            prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]
        );
    };

    const handleNext = async () => {
        if (selectedMeals.length < 1) {
            alert("Please select at least one meal before proceeding.");
            return;
        }

        try {
            await fetch("http://localhost:8000/update-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ meal_plan_selection: selectedMeals.join(",") }),
            });
            navigate("/activity-level");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-green-600">Select Your Meals</h1>
                    <p className="text-gray-600">Choose at least one meal to continue.</p>
                </div>

                {/* Meal Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {meals.map((meal) => (
                        <button
                            key={meal.id}
                            onClick={() => handleMealSelection(meal.id)}
                            className={`flex items-center justify-between p-6 rounded-lg border-2 cursor-pointer transition-all
                ${selectedMeals.includes(meal.id)
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 hover:border-green-300"
                                }
              `}
                        >
                            <span className="text-3xl">{meal.icon}</span>
                            <h3 className="text-xl font-semibold text-gray-800">{meal.name}</h3>
                            {selectedMeals.includes(meal.id) ? (
                                <div className="bg-green-500 text-white rounded-full p-1">✅</div>
                            ) : (
                                <div className="border-2 border-gray-300 rounded-full w-6 h-6"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <div className="text-center">
                    <button
                        onClick={handleNext}
                        disabled={selectedMeals.length < 1}
                        className={`px-8 py-3 bg-green-600 text-white rounded-lg text-lg transition-colors
              ${selectedMeals.length < 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-green-700"
                            }
            `}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealPlan;
