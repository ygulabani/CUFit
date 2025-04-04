import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserMealPlan = () => {
    const navigate = useNavigate();
    const [mealPlan, setMealPlan] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('breakfast');

    const fetchUserProfile = useCallback(async (token) => {
        try {
            const response = await axios.get("http://localhost:8000/workout/get-profile/", {
                headers: { Authorization: `Bearer ${token}` },
            });
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
                <p className="text-green-600 font-medium">Crafting your perfect meal plan...</p>
            </div>
        </div>
    );

    const mealTabs = [
        { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
        { id: 'lunch', label: 'Lunch', icon: '🌞' },
        { id: 'dinner', label: 'Dinner', icon: '🌙' },
        { id: 'snacks', label: 'Snacks', icon: '🍎' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
                    {/* Header with User Preferences */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8 md:p-10">
                        <div className="relative mb-8">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="absolute top-0 left-0 bg-white/20 backdrop-blur-md text-white font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-800/10"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2 tracking-tight">Your Perfect Meal Plan</h2>
                            <p className="text-green-50 text-center text-sm sm:text-base md:text-lg">Tailored to your preferences and goals</p>
                        </div>
                    </div>

                    {/* Meal Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto no-scrollbar">
                            {mealTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 min-w-[120px] py-4 px-6 text-center transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? "border-b-2 border-green-500 text-green-600"
                                            : "text-gray-500 hover:text-green-500"
                                    }`}
                                >
                                    <span className="text-2xl mb-1 block">{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
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
                            <div className="space-y-6">
                                {mealPlan?.[activeTab]?.length > 0 ? (
                                    mealPlan[activeTab].map((meal) => (
                                        <div
                                            key={meal.meal_id}
                                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                                                        {meal.name}
                                                    </h4>
                                                    <p className="text-gray-600 mb-4">{meal.instructions}</p>
                                                    
                                                    {/* Nutrition Grid */}
                                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                                        <div className="bg-green-50 rounded-lg p-3 text-center transform transition-transform group-hover:scale-105">
                                                            <span className="block text-sm font-medium text-green-600">Calories</span>
                                                            <span className="text-gray-700 font-semibold">{meal.calories}</span>
                                                        </div>
                                                        <div className="bg-green-50 rounded-lg p-3 text-center transform transition-transform group-hover:scale-105">
                                                            <span className="block text-sm font-medium text-green-600">Protein</span>
                                                            <span className="text-gray-700 font-semibold">{meal.protein}g</span>
                                                        </div>
                                                        <div className="bg-green-50 rounded-lg p-3 text-center transform transition-transform group-hover:scale-105">
                                                            <span className="block text-sm font-medium text-green-600">Carbs</span>
                                                            <span className="text-gray-700 font-semibold">{meal.carbs}g</span>
                                                        </div>
                                                        <div className="bg-green-50 rounded-lg p-3 text-center transform transition-transform group-hover:scale-105">
                                                            <span className="block text-sm font-medium text-green-600">Fat</span>
                                                            <span className="text-gray-700 font-semibold">{meal.fat}g</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Recipe Link */}
                                                {meal.recipe_link && (
                                                    <div className="flex-shrink-0">
                                                        <a
                                                            href={meal.recipe_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-green-200 transition-all duration-300"
                                                        >
                                                            View Recipe
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">🍽️</div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No meals available</h3>
                                        <p className="text-gray-600">We're working on adding more delicious meals that match your preferences.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMealPlan;