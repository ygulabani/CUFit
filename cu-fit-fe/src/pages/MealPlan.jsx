import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
                    navigate("/activity-level");
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
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
                            Back
                        </button>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2 tracking-tight">
                        Select Your Meals
                        </h2>
                        <p className="text-green-50 text-center text-sm sm:text-base md:text-lg">
                        Choose which meals you would like to include in your plan
                    </p>
                </div>

                    <div className="p-6 sm:p-8 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { id: "breakfast", name: "Breakfast", icon: "🍳", description: "Start your day right" },
                                { id: "lunch", name: "Lunch", icon: "🥪", description: "Midday nourishment" },
                                { id: "dinner", name: "Dinner", icon: "🍽️", description: "Evening delight" },
                                { id: "snacks", name: "Snacks", icon: "🍎", description: "Healthy bites" },
                    ].map((meal) => (
                        <button
                            key={meal.id}
                            onClick={() => handleMealToggle(meal.id)}
                                    className={`group relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                                selectedMeals.includes(meal.id)
                                            ? "bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl shadow-green-100/50"
                                            : "bg-white/50 hover:bg-white shadow-lg hover:shadow-xl"
                                    }`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`text-4xl mb-4 transform transition-transform duration-300 ${
                                            selectedMeals.includes(meal.id) ? "scale-110" : "group-hover:scale-110"
                                        }`}>
                                            {meal.icon}
                                        </div>
                                        <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                                            selectedMeals.includes(meal.id) ? "text-green-700" : "text-gray-800"
                                        }`}>
                                {meal.name}
                            </h3>
                                        <p className={`text-sm transition-colors duration-300 ${
                                            selectedMeals.includes(meal.id) ? "text-green-600" : "text-gray-500"
                                        }`}>
                                            {meal.description}
                                        </p>
                                        <div className={`w-full h-1 rounded-full mt-4 transition-all duration-300 ${
                                            selectedMeals.includes(meal.id) 
                                                ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                                                : "bg-gray-200 group-hover:bg-gray-300"
                                        }`} />
                                    </div>
                                    {selectedMeals.includes(meal.id) && (
                                        <div className="absolute top-3 right-3 opacity-0 scale-90 animate-[fadeIn_0.3s_ease-out_forwards]">
                                            <div className="bg-green-500 rounded-full p-1">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                        </button>
                    ))}
                </div>

                {selectedMeals.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleNext}
                            disabled={loading}
                                    className={`group relative px-8 py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 transform ${
                                        loading
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-2xl hover:shadow-green-200 hover:scale-[1.02]"
                                    }`}
                                >
                                    <span className="relative z-10">
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Saving...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                {isEditing ? "Save Changes" : "Next"}
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        )}
                                    </span>
                        </button>
                    </div>
                )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealPlan;
