import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user profile
                const profileResponse = await fetch("http://127.0.0.1:8000/get-profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!profileResponse.ok) throw new Error("Failed to fetch profile");
                const profileData = await profileResponse.json();

                // Fetch meal plan
                const mealPlanResponse = await fetch("http://127.0.0.1:8000/meals/api/user-meal-plan/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!mealPlanResponse.ok) throw new Error("Failed to fetch meal plan");
                const mealPlanData = await mealPlanResponse.json();

                setUserData(profileData);
                setMealPlan(mealPlanData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
            {/* Logout and Navigation Buttons */}
            <div className="flex flex-col items-center gap-3">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition font-semibold mt-2"
                >
                    Logout
                </button>
                <div className="flex flex-row gap-4">
                    <button
                        onClick={() => navigate("/meal-around-campus")}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
                    >
                        Meal Around Campus
                    </button>
                    <button
                        onClick={() => navigate("/exercises-list")}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
                    >
                        Exercises List
                    </button>
                    <button
                        onClick={() => navigate("/exercises-master")}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
                    >
                        Master Workout
                    </button>
                    <button
                        onClick={() => navigate("/calender")}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
                    >
                        Edit Preference
                    </button>
                    <button
                        onClick={() => navigate("/user-meal-plan")}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
                    >
                        Your Meal-plan
                    </button>
                </div>
            </div>
            <br></br>

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Current Diet", value: userData.diet_selection || "Not set", icon: "🥑" },
                        { label: "Activity Level", value: userData.activity_level || "Not set", icon: "🏋️‍♀️" },
                        { label: "Diet Preference", value: userData.diet_preference || "Not set", icon: "🔥" },
                        { label: "Cooking Time", value: userData.cooking_time_preference || "Not set", icon: "⏳" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{stat.icon}</span>
                                <div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fitness Goals Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Your Fitness Goals
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {userData.goal_selection || "Not set"}
                        </span>
                    </div>
                </div>

                {/* Meal Plan */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Today's Meal Plan
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {mealPlan && Object.entries(mealPlan).map(([mealType, meals]) => (
                                <div
                                    key={mealType}
                                    className="border-b border-gray-100 pb-4 last:border-0"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium text-gray-900 capitalize">
                                            {mealType}
                                        </h3>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {meals.map((meal, index) => (
                                            <div key={index} className="mb-1">
                                                {meal.name} - {meal.calories} calories
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exercise Routine */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Exercise Routine
                        </h2>
                        <div className="divide-y divide-gray-100">
                            {userData.exercise_routine ? (
                                <div className="py-3">
                                    <div className="text-sm text-gray-600">
                                        {userData.exercise_routine}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-3 text-gray-500">
                                    No exercise routine set
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* BMI Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        BMI Information
                    </h2>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {userData.bmi || "Not set"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
