import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StretchingPreference = () => {
    const [wantsStretching, setWantsStretching] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await axios.post(
                "http://127.0.0.1:8000/workout/api/update-stretching-preference/",
                { stretching_preference: wantsStretching },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to save preference. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Desk-Friendly Stretching Exercises
                    </h1>
                    <p className="text-xl text-gray-600">
                        Would you like to include desk-friendly stretching exercises in your workout plan?
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Perfect for Busy Students
                            </h2>
                            <p className="text-gray-600 mb-6">
                                These exercises are designed to help you stay active and relieve tension, even during long study sessions or when sitting for extended periods.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Benefits Include:</h3>
                                <ul className="space-y-2 text-green-700">
                                    <li>• Reduced back and neck pain</li>
                                    <li>• Improved posture</li>
                                    <li>• Better circulation</li>
                                    <li>• Increased energy levels</li>
                                    <li>• Stress relief</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-800 mb-2">Exercise Types:</h3>
                                <ul className="space-y-2 text-blue-700">
                                    <li>• Neck stretches</li>
                                    <li>• Shoulder rolls</li>
                                    <li>• Wrist exercises</li>
                                    <li>• Seated twists</li>
                                    <li>• Desk push-ups</li>
                                </ul>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8">
                            <div className="flex justify-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setWantsStretching(true)}
                                    className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                                        wantsStretching === true
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Yes, Include Stretches
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setWantsStretching(false)}
                                    className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                                        wantsStretching === false
                                            ? "bg-red-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    No, Skip Stretches
                                </button>
                            </div>

                            {error && (
                                <div className="mt-4 text-center text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="mt-8 text-center">
                                <button
                                    type="submit"
                                    disabled={wantsStretching === null || loading}
                                    className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${
                                        wantsStretching === null || loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                    }`}
                                >
                                    {loading ? "Saving..." : "Save Preference"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StretchingPreference; 