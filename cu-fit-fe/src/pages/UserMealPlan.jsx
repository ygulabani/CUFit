import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserMealPlan = () => {
    const navigate = useNavigate();
    const [mealPlan, setMealPlan] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserProfile = useCallback(async (token) => {
        try {
            const response = await axios.get("http://localhost:8000/workout/get-profile/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("User profile response:", response.data);
            setUserProfile(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setError("Failed to load user profile. Please try again.");
        }
    }, []);

    const fetchMealPlan = useCallback(async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("User not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        try {
            await fetchUserProfile(token);

            const response = await axios.get("http://localhost:8000/meals/api/user-meal-plan/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Meal plan response:", response.data);

            if (response.data) {
                setMealPlan(response.data);
            } else {
                setMealPlan({
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    snacks: [],
                });
            }
        } catch (error) {
            console.error("Error fetching meal plan:", error);
            setError(error.response?.data?.error || "Failed to load meal plan. Please try again.");
            setMealPlan({
                breakfast: [],
                lunch: [],
                dinner: [],
                snacks: [],
            });
        } finally {
            setLoading(false);
        }
    }, [fetchUserProfile]);

    useEffect(() => {
        fetchMealPlan();
    }, [fetchMealPlan]);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                <p className="text-green-600 font-medium">Loading your meal plan...</p>
            </div>
        </div>
    );

    const isMealTypeIncluded = (mealType) => {
        if (!userProfile?.meal_plan_selection) return false;
        const selection = userProfile.meal_plan_selection.toLowerCase();
        return selection.includes(mealType.toLowerCase());
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8 md:p-10 relative">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-800/10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2 tracking-tight">Your Personalized Meal Plan</h2>
                        <p className="text-green-50 text-center text-sm sm:text-base md:text-lg">Nourish your body with our carefully crafted meals</p>
                    </div>

                    <div className="p-6 sm:p-8 md:p-10">
                        {error ? (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                <p className="text-red-600 font-medium mb-4">{error}</p>
                                <button
                                    onClick={fetchMealPlan}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-green-200 transition-all duration-300"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-8">
                                {isMealTypeIncluded("breakfast") && (
                                    <MealSection title="Breakfast" meals={mealPlan?.breakfast} icon="🌅" />
                                )}
                                {isMealTypeIncluded("lunch") && (
                                    <MealSection title="Lunch" meals={mealPlan?.lunch} icon="🌞" />
                                )}
                                {isMealTypeIncluded("dinner") && (
                                    <MealSection title="Dinner" meals={mealPlan?.dinner} icon="🌙" />
                                )}
                                {isMealTypeIncluded("snacks") && (
                                    <MealSection title="Snacks" meals={mealPlan?.snacks} icon="🍎" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MealSection = ({ title, meals, icon }) => (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">{icon}</div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-700">{title}</h3>
        </div>
        {meals?.length ? (
            <div className="grid gap-6">
                {meals.map((meal) => (
                    <div key={meal.meal_id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="flex-1">
                                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                    {meal.name}
                                </h4>
                                <p className="text-gray-600 text-sm sm:text-base mb-4">{meal.instructions}</p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-green-50 rounded-lg p-3 text-center">
                                        <span className="block text-sm font-medium text-green-600">Protein</span>
                                        <span className="text-gray-700 font-semibold">{meal.protein}g</span>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3 text-center">
                                        <span className="block text-sm font-medium text-green-600">Carbs</span>
                                        <span className="text-gray-700 font-semibold">{meal.carbs}g</span>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3 text-center">
                                        <span className="block text-sm font-medium text-green-600">Fat</span>
                                        <span className="text-gray-700 font-semibold">{meal.fat}g</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:text-right">
                                <div className="bg-green-100 rounded-lg p-3 inline-block">
                                    <p className="text-green-700 font-medium">{meal.calories} calories</p>
                                    <p className="text-sm text-green-600">{meal.cooking_time}</p>
                                </div>
                                {meal.recipe_link && (
                                    <a
                                        href={meal.recipe_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                                    >
                                        View Recipe
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-gray-500">No {title.toLowerCase()} meals available.</p>
            </div>
        )}
    </div>
);

export default UserMealPlan;