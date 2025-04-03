import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const ActivityLevelSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;
    const [selectedLevel, setSelectedLevel] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // If editing, fetch current activity level
        if (isEditing) {
            const fetchCurrentLevel = async () => {
                try {
                    const response = await fetch("http://localhost:8000/workout/get-profile/", {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    const data = await response.json();
                    if (data.activity_level) {
                        setSelectedLevel(data.activity_level);
                    }
                } catch (error) {
                    console.error("Error fetching activity level:", error);
                    toast.error("Failed to fetch current activity level");
                }
            };
            fetchCurrentLevel();
        }
    }, [navigate, isEditing]);

    const activityLevels = [
        {
            level: "sedentary",
            title: "Sedentary",
            description: "Little or no exercise, desk job",
            icon: "🪑"
        },
        {
            level: "light",
            title: "Lightly Active",
            description: "Light exercise 1-3 days/week",
            icon: "🚶"
        },
        {
            level: "moderate",
            title: "Moderately Active",
            description: "Moderate exercise 3-5 days/week",
            icon: "🏃"
        },
        {
            level: "very",
            title: "Very Active",
            description: "Hard exercise 6-7 days/week",
            icon: "🏋️"
        },
        {
            level: "extra",
            title: "Extra Active",
            description: "Very hard exercise, physical job or training",
            icon: "💪"
        }
    ];

    const handleSubmit = async () => {
        if (!selectedLevel) {
            toast.error("Please select an activity level");
            return;
        }

        setLoading(true);

        try {
            await fetch("http://localhost:8000/update-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ activity_level: selectedLevel }),
            });

            toast.success("Activity level updated successfully!");

            // If editing single preference, go back to edit preferences
            if (isEditing) {
                navigate("/edit-preferences");
            } else {
                // Continue with new user flow
                navigate("/exercise-difficulty");
            }
        } catch (error) {
            console.error("Error updating activity level:", error);
            toast.error("Failed to update activity level");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Select Your Activity Level</h1>
                    {isEditing && (
                        <button
                            onClick={() => navigate("/edit-preferences")}
                            className="text-green-500 hover:text-green-600"
                        >
                            Back to Preferences
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {activityLevels.map((activity) => (
                        <button
                            key={activity.level}
                            onClick={() => setSelectedLevel(activity.level)}
                            className={`w-full p-4 rounded-lg border ${
                                selectedLevel === activity.level
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 bg-white hover:border-green-300"
                            } transition-all`}
                        >
                            <div className="flex items-center space-x-4">
                                <span className="text-2xl">{activity.icon}</span>
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedLevel}
                        className={`w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 ${
                            (loading || !selectedLevel) && "opacity-50 cursor-not-allowed"
                        }`}
                    >
                        {loading ? "Saving..." : isEditing ? "Save Changes" : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityLevelSelection;
