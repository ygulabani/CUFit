import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const exerciseOptions = [
    { id: "strength", name: "💪 Strength Training (Muscle Building & Toning)" },
    { id: "fat-loss", name: "🔥 Fat Loss & Weight Loss (HIIT & Cardio)" },
    { id: "flexibility", name: "🧘 Flexibility & Mobility (Yoga & Pilates)" },
    { id: "sports", name: "🏆 Sports & Functional Fitness" },
    { id: "low-impact", name: "🚶‍♂️ Low-Impact Routines (For Beginners & Recovery)" },
];

const ExerciseRoutine = () => {
    const [selectedExercise, setSelectedExercise] = useState(null);
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

        // If editing, fetch current exercise routine
        if (isEditing) {
            const fetchCurrentRoutine = async () => {
                try {
                    const response = await fetch("http://localhost:8000/workout/get-profile/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    const data = await response.json();
                    if (data.exercise_routine) {
                        setSelectedExercise(data.exercise_routine);
                    }
                } catch (error) {
                    console.error("Error fetching exercise routine:", error);
                    toast.error("Failed to fetch current exercise routine");
                }
            };
            fetchCurrentRoutine();
        }
    }, [navigate, isEditing]);

    const handleExerciseSelect = (exerciseId) => {
        setSelectedExercise(exerciseId);
    };

    const handleNext = async () => {
        if (!selectedExercise) {
            toast.error("Please select an exercise routine");
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
                    exercise_routine: selectedExercise,
                }),
            });

            if (response.ok) {
                toast.success("Exercise routine saved successfully!");
                if (isEditing) {
                    navigate("/edit-preferences");
                } else {
                    navigate("/pain-injury-form");
                }
            } else {
                toast.error("Failed to save exercise routine. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to save exercise routine");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-green-600">
                        Select Your Exercise Routine
                    </h1>
                    <p className="text-gray-600">
                        Please choose one exercise routine that best fits your fitness goals.
                    </p>
                </div>

                {/* Exercise Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exerciseOptions.map((exercise) => (
                        <button
                            key={exercise.id}
                            onClick={() => handleExerciseSelect(exercise.id)}
                            className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg text-left
                                ${selectedExercise === exercise.id
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 bg-white hover:border-green-200"
                                }
                            `}
                        >
                            <h3 className="text-lg font-semibold text-gray-900">
                                {exercise.name}
                            </h3>
                            <div
                                className={`w-full h-1 rounded-full mt-4 ${selectedExercise === exercise.id ? "bg-green-500" : "bg-gray-200"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Navigation Buttons */}
                {selectedExercise && (
                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors duration-200"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                        >
                            {loading ? "Saving..." : isEditing ? "Save Changes" : "Next"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseRoutine;
