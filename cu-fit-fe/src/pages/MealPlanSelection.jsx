import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mealPlans = {
    Monday: {
        breakfast: { name: "Oatmeal & Fruits", link: "https://example.com/oatmeal" },
        lunch: { name: "Grilled Chicken Salad", link: "https://example.com/salad" },
        snacks: { name: "Greek Yogurt & Nuts", link: "https://example.com/yogurt" },
        dinner: { name: "Salmon & Quinoa", link: "https://example.com/salmon" },
    },
    Tuesday: {
        breakfast: { name: "Smoothie Bowl", link: "https://example.com/smoothie" },
        lunch: { name: "Veggie Wrap", link: "https://example.com/wrap" },
        snacks: { name: "Apple & Peanut Butter", link: "https://example.com/apple" },
        dinner: { name: "Stir-fry Tofu & Rice", link: "https://example.com/tofu" },
    },
    Wednesday: {
        breakfast: { name: "Pancakes & Berries", link: "https://example.com/pancakes" },
        lunch: { name: "Quinoa & Chickpea Bowl", link: "https://example.com/quinoa" },
        snacks: { name: "Hummus & Carrots", link: "https://example.com/hummus" },
        dinner: { name: "Grilled Fish & Veggies", link: "https://example.com/fish" },
    },
    Thursday: {
        breakfast: { name: "Avocado Toast", link: "https://example.com/avocado" },
        lunch: { name: "Grilled Cheese Sandwich", link: "https://example.com/sandwich" },
        snacks: { name: "Protein Shake", link: "https://example.com/shake" },
        dinner: { name: "Chicken Curry & Rice", link: "https://example.com/curry" },
      },
      Friday: {
        breakfast: { name: "Egg Scramble", link: "https://example.com/eggs" },
        lunch: { name: "Pasta Primavera", link: "https://example.com/pasta" },
        snacks: { name: "Granola Bar", link: "https://example.com/granola" },
        dinner: { name: "Turkey & Sweet Potato", link: "https://example.com/turkey" },
      },
      Saturday: {
        breakfast: { name: "French Toast", link: "https://example.com/french-toast" },
        lunch: { name: "Lentil Soup", link: "https://example.com/lentil-soup" },
        snacks: { name: "Fruit Salad", link: "https://example.com/fruit-salad" },
        dinner: { name: "Sushi Rolls", link: "https://example.com/sushi" },
      },
      Sunday: {
        breakfast: { name: "Yogurt Parfait", link: "https://example.com/parfait" },
        lunch: { name: "BBQ Chicken Bowl", link: "https://example.com/bbq" },
        snacks: { name: "Dark Chocolate & Almonds", link: "https://example.com/chocolate" },
        dinner: { name: "Veggie Pizza", link: "https://example.com/pizza" },
      },
    
};

const MealPlanSelection = () => {
    const [selectedDay, setSelectedDay] = useState("Monday");
    const navigate = useNavigate();

    const handleNext = async () => {
        try {
            await fetch("http://localhost:8000/update-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ meal_plan: selectedDay }),
            });
            navigate("/meal-plan"); // Navigate to the next step
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-green-600">7-Day Meal Plan</h1>
                    <p className="text-gray-600">Select a day to view your meal plan.</p>
                </div>

                {/* Day Selection */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {Object.keys(mealPlans).map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors
                ${selectedDay === day
                                    ? "bg-green-500 text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-green-100"
                                }
              `}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Meal Plan Display */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
                        {selectedDay}'s Meal Plan
                    </h2>

                    <div className="space-y-4">
                        {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
                            <div key={meal} className="border-b last:border-0 pb-4">
                                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                                    {meal}
                                </h3>
                                <p className="text-gray-600">
                                    {mealPlans[selectedDay][meal].name} -{" "}
                                    <a
                                        href={mealPlans[selectedDay][meal].link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:underline"
                                    >
                                        View Recipe
                                    </a>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleNext}
                        className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealPlanSelection;
