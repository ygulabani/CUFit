import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserMealPlan = () => {
    const navigate = useNavigate();
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMealPlans = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:8000/usermealplans/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMealPlans(response.data);
            } catch (error) {
                console.error("Error fetching meal plans:", error);
                setError("Failed to load meal plans. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlans();
    }, []);

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Your Meal Plans
                    </h2>
                    {mealPlans.length === 0 ? (
                        <p className="text-center text-gray-600">No meal plans found.</p>
                    ) : (
                        mealPlans.map((mealPlan) => (
                            <div key={mealPlan.id} className="border-b border-gray-100 pb-4 last:border-0">
                                <h3 className="font-medium text-gray-900">{mealPlan.date}</h3>
                                <p className="text-sm text-gray-600">Breakfast: {mealPlan.breakfast.instructions}</p>
                                <p className="text-sm text-gray-600">Lunch: {mealPlan.lunch.instructions}</p>
                                <p className="text-sm text-gray-600">Dinner: {mealPlan.dinner.instructions}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition font-semibold"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserMealPlan;
