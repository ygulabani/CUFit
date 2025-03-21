import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserWorkout = () => {
    const navigate = useNavigate();
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                headers: { Authorization: `Bearer ${token}` },
            });

            setWorkoutPlan(response.data);
        } catch (error) {
            console.error("Error fetching workout plan:", error);
            setError(error.response?.data?.error || "Failed to load workout plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkoutPlan();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-green-600">Your Personalized Workout Plan</h2>
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
                ) : (
                    <div className="space-y-6">
                        <WorkoutSection title="Warm Up" exercises={workoutPlan?.warm_up} />
                        <WorkoutSection title="Main Exercises" exercises={workoutPlan?.main_exercises} />
                        <WorkoutSection title="Cool Down" exercises={workoutPlan?.cool_down} />
                    </div>
                )}
            </div>
        </div>
    );
};

const WorkoutSection = ({ title, exercises }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-green-600 mb-4">{title}</h3>
        {exercises?.length ? (
            <div className="grid gap-4">
                {exercises.map((exercise) => (
                    <div key={exercise.exercise_id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-green-300 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">
                                    {exercise.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-green-600">{exercise.duration} minutes</p>
                                <p className="text-xs text-gray-500">
                                    {exercise.difficulty}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="text-center">
                                <span className="font-medium text-green-600">Sets</span>
                                <p className="text-gray-600">{exercise.sets}</p>
                            </div>
                            <div className="text-center">
                                <span className="font-medium text-green-600">Reps</span>
                                <p className="text-gray-600">{exercise.reps}</p>
                            </div>
                        </div>
                        {exercise.video_link && (
                            <div className="mt-3 text-center">
                                <a
                                    href={exercise.video_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-500 hover:text-green-600 text-sm"
                                >
                                    Watch Tutorial →
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} exercises available.</p>
        )}
    </div>
);

export default UserWorkout; 