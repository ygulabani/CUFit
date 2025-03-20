import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserMealPlan = () => {
    const navigate = useNavigate();
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMealPlan = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("User not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/meals/api/user-meal-plan/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMealPlan(response.data);
        } catch (error) {
            console.error("Error fetching meal plan:", error);
            setError(error.response?.data?.error || "Failed to load meal plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMealPlan();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Your Personalized Meal Plan</h2>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error ? (
                    <div className="text-red-600 text-center">
                        <p>{error}</p>
                        <button
                            onClick={fetchMealPlan}
                            className="bg-red-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-red-600 transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <MealSection title="Breakfast" meals={mealPlan?.breakfast} />
                        <MealSection title="Lunch" meals={mealPlan?.lunch} />
                        <MealSection title="Dinner" meals={mealPlan?.dinner} />
                        <MealSection title="Snacks" meals={mealPlan?.snacks} />
                    </div>
                )}
            </div>
        </div>
    );
};

const MealSection = ({ title, meals }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        {meals?.length ? (
            <div className="grid gap-4">
                {meals.map((meal) => (
                    <div key={meal.meal_id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">
                                    {meal.get_meal_type_display || title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">{meal.instructions}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-blue-600">{meal.calories} calories</p>
                                <p className="text-xs text-gray-500">
                                    {meal.get_cooking_time_display || meal.cooking_time}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                                <span className="font-medium">Protein</span>
                                <p className="text-gray-600">{meal.protein}g</p>
                            </div>
                            <div className="text-center">
                                <span className="font-medium">Carbs</span>
                                <p className="text-gray-600">{meal.carbs}g</p>
                            </div>
                            <div className="text-center">
                                <span className="font-medium">Fat</span>
                                <p className="text-gray-600">{meal.fat}g</p>
                            </div>
                        </div>
                        {meal.recipe_link && (
                            <div className="mt-3 text-center">
                                <a
                                    href={meal.recipe_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 text-sm"
                                >
                                    View Recipe →
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} meals available.</p>
        )}
    </div>
);

export default UserMealPlan;