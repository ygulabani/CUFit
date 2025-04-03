import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StretchingPreference = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleStretchingChoice = async (wantsStretching) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            await axios.post(
                "http://localhost:8000/workout/api/update-stretching/",
                { stretching_preference: wantsStretching },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            navigate("/calender");
        } catch (err) {
            console.error("Error updating stretching preference:", err);
            setError(err.response?.data?.error || "Failed to update stretching preference");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    <p className="text-emerald-600 font-medium animate-pulse">Updating your preferences...</p>
                </div>
            </div>
        );
    }

    const stretchingBenefits = [
        {
            icon: "🔄",
            title: "Improved Flexibility",
            description: "Enhance your range of motion and reduce muscle stiffness"
        },
        {
            icon: "💪",
            title: "Injury Prevention",
            description: "Lower your risk of exercise-related injuries"
        },
        {
            icon: "🧘‍♂️",
            title: "Better Posture",
            description: "Maintain proper alignment and reduce muscle tension"
        },
        {
            icon: "⚡",
            title: "Enhanced Performance",
            description: "Improve your workout efficiency and muscle recovery"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Stretching Exercises
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Would you like to include guided stretching exercises in your fitness routine? 
                        These exercises can help improve your flexibility and overall workout performance.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Benefits Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <span className="text-2xl">✨</span>
                            Benefits of Stretching
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {stretchingBenefits.map((benefit, index) => (
                                <div 
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 group hover:shadow-md transition-all duration-300"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                        {benefit.icon}
                                    </span>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                                        <p className="text-sm text-gray-600">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Choice Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <span className="text-2xl">🎯</span>
                            Make Your Choice
                        </h2>
                        
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                <p className="text-red-600 text-center">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={() => handleStretchingChoice(true)}
                                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
                            >
                                <span className="text-xl group-hover:rotate-12 transition-transform duration-300">🎉</span>
                                Yes, Include Stretching Exercises
                            </button>
                            <button
                                onClick={() => handleStretchingChoice(false)}
                                className="w-full bg-white text-gray-700 px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
                            >
                                <span className="text-xl group-hover:rotate-12 transition-transform duration-300">⏭️</span>
                                Skip Stretching Exercises
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                You can always change this preference later in your profile settings
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StretchingPreference; 