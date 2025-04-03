import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const MealPlan = () => {
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // If editing, fetch current meal plan selection
        if (isEditing) {
            const fetchCurrentSelection = async () => {
                try {
                    const response = await fetch("http://localhost:8000/workout/get-profile/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    const data = await response.json();
                    if (data.meal_plan_selection) {
                        setSelectedMeals(data.meal_plan_selection.split(","));
                    }
                } catch (error) {
                    console.error("Error fetching meal plan selection:", error);
                    toast.error("Failed to fetch current meal plan selection");
                }
            };
            fetchCurrentSelection();
        }
    }, [navigate, isEditing]);

    const handleMealToggle = (meal) => {
        setSelectedMeals((prev) =>
            prev.includes(meal)
                ? prev.filter((m) => m !== meal)
                : [...prev, meal]
        );
    };

    const handleNext = async () => {
        if (selectedMeals.length === 0) {
            toast.error("Please select at least one meal");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/update-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    meal_plan_selection: selectedMeals.join(","),
                }),
            });

            if (response.ok) {
                toast.success("Meal plan selection saved successfully!");
                if (isEditing) {
                    navigate("/edit-preferences");
                } else {
                    navigate("/user-meal-plan");
                }
            } else {
                toast.error("Failed to save meal plan selection. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to save meal plan selection");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-green-600 mb-2">
                        Select Your Meals
                    </h1>
                    <p className="text-gray-600">
                        Choose which meals you would like to include in your plan
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { id: "breakfast", name: "Breakfast", icon: "🍳" },
                        { id: "lunch", name: "Lunch", icon: "🥪" },
                        { id: "dinner", name: "Dinner", icon: "🍽️" },
                        { id: "snacks", name: "Snacks", icon: "🍎" },
                    ].map((meal) => (
                        <button
                            key={meal.id}
                            onClick={() => handleMealToggle(meal.id)}
                            className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                ${
                                selectedMeals.includes(meal.id)
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 bg-white hover:border-green-300"
                            }
                `}
                        >
                            <div className="text-4xl mb-3">{meal.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {meal.name}
                            </h3>
                            <div
                                className={`w-full h-1 rounded-full mt-4 ${
                                    selectedMeals.includes(meal.id) ? "bg-green-500" : "bg-gray-200"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {selectedMeals.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                        >
                            {loading ? "Saving..." : isEditing ? "Save Changes" : "Next"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealPlan;
