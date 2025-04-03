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

            navigate("/dashboard");
        } catch (err) {
            console.error("Error updating stretching preference:", err);
            setError(err.response?.data?.error || "Failed to update stretching preference");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                    Would you like stretching exercises?
                </h2>
                
                {error && (
                    <div className="mb-4 text-center text-red-600">
                        <p>{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={() => handleStretchingChoice(true)}
                        className="w-full bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Yes, I want stretching exercises
                    </button>
                    <button
                        onClick={() => handleStretchingChoice(false)}
                        className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                        No, skip stretching exercises
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StretchingPreference; 