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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8 md:p-10 relative">
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-800/10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2 tracking-tight">
                            Select Your Exercise Routine
                        </h2>
                        <p className="text-green-50 text-center text-sm sm:text-base md:text-lg">
                            Please choose one exercise routine that best fits your fitness goals
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {exerciseOptions.map((exercise) => (
                                <button
                                    key={exercise.id}
                                    onClick={() => handleExerciseSelect(exercise.id)}
                                    className={`group relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                                        selectedExercise === exercise.id
                                            ? "bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl shadow-green-100/50"
                                            : "bg-white/50 hover:bg-white shadow-lg hover:shadow-xl"
                                    }`}
                                >
                                    <div className="flex flex-col items-start text-left">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`text-3xl transform transition-transform duration-300 ${
                                                selectedExercise === exercise.id ? "scale-110" : "group-hover:scale-110"
                                            }`}>
                                                {exercise.name.split(" ")[0]}
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                                                    selectedExercise === exercise.id ? "text-green-700" : "text-gray-800"
                                                }`}>
                                                    {exercise.name.split(" ").slice(1).join(" ")}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className={`w-full h-1 rounded-full mt-4 transition-all duration-300 ${
                                            selectedExercise === exercise.id 
                                                ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                                                : "bg-gray-200 group-hover:bg-gray-300"
                                        }`} />
                                    </div>
                                    {selectedExercise === exercise.id && (
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

                        {selectedExercise && (
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

export default ExerciseRoutine;
