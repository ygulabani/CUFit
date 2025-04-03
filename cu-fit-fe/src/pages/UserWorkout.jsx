import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserWorkout = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterInfo, setFilterInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchWorkoutPlan();
    }, [navigate]);

    const fetchWorkoutPlan = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("User not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/workout/api/user-workout/", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Workout response:", response.data); // Debug log

            if (response.data && response.data.exercises) {
                setExercises(response.data.exercises);
                setFilterInfo(response.data.filters_applied || {});
            } else {
                setError("No workout data available. Please complete your profile first.");
            }
        } catch (error) {
            console.error("Error fetching workout plan:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            } else if (error.response?.status === 404) {
                navigate("/calender");
            } else {
                setError(
                    error.response?.data?.error || 
                    "Failed to load workout plan. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-green-600">Your Personalized Workout Plan</h2>
                        {filterInfo && (
                            <p className="text-sm text-gray-600 mt-1">
                                Difficulty Level: {filterInfo.difficulty} | Activity Level: {filterInfo.activity_level}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error ? (
                    <div className="text-red-600 text-center">
                        <p>{error}</p>
                        <button
                            onClick={fetchWorkoutPlan}
                            className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-green-600 transition"
                        >
                            Retry
                        </button>
                    </div>
                ) : exercises.length > 0 ? (
                    <div className="grid gap-4">
                        {exercises.map((exercise) => (
                            <div key={exercise.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:border-green-300 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900">
                                            {exercise.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Type: {exercise.exercise_type} | Body Part: {exercise.body_part}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-green-600">{exercise.duration} minutes</p>
                                        <p className="text-xs text-gray-500">
                                            {exercise.difficulty} | Impact: {exercise.impact_level}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                                    <div className="text-center bg-gray-100 rounded p-2">
                                        <span className="font-medium text-green-600">Sets</span>
                                        <p className="text-gray-600">{exercise.sets}</p>
                                    </div>
                                    <div className="text-center bg-gray-100 rounded p-2">
                                        <span className="font-medium text-green-600">Reps</span>
                                        <p className="text-gray-600">{exercise.reps}</p>
                                    </div>
                                    <div className="text-center bg-gray-100 rounded p-2">
                                        <span className="font-medium text-green-600">Duration</span>
                                        <p className="text-gray-600">{exercise.duration} min</p>
                                    </div>
                                </div>
                                {exercise.instructions && (
                                    <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                        <p className="font-medium text-green-600 mb-1">Instructions:</p>
                                        <p>{exercise.instructions}</p>
                                    </div>
                                )}
                                {exercise.video_link && (
                                    <div className="mt-3 text-center">
                                        <a
                                            href={exercise.video_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-green-500 hover:text-green-600 text-sm bg-green-50 px-4 py-2 rounded-full"
                                        >
                                            Watch Tutorial <span className="ml-1">→</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No exercises available for your current profile.</p>
                        <button
                            onClick={() => navigate("/calender")}
                            className="text-green-500 hover:text-green-600 text-sm bg-green-50 px-4 py-2 rounded-full"
                        >
                            Complete Your Profile →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserWorkout; 