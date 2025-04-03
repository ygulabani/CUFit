import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const fitnessGoals = [
    {
        id: "weight-loss",
        name: "Lose Weight",
        icon: "⚖️",
        description: "Reduce body fat while maintaining muscle mass",
    },
    {
        id: "muscle-gain",
        name: "Build Muscle",
        icon: "💪",
        description: "Increase muscle mass and strength",
    },
    {
        id: "get-lean",
        name: "Get Lean",
        icon: "🏃",
        description: "Reduce body fat while maintaining athletic performance",
    },
    {
        id: "maintain",
        name: "Maintain Fitness",
        icon: "🎯",
        description: "Keep current physique and improve overall health",
    },
    {
        id: "strength",
        name: "Increase Strength",
        icon: "🏋️‍♂️",
        description: "Focus on power and strength gains",
    },
    {
        id: "endurance",
        name: "Build Endurance",
        icon: "🏃‍♀️",
        description: "Improve stamina and cardiovascular fitness",
    },
    {
        id: "flexibility",
        name: "Improve Flexibility",
        icon: "🧘‍♀️",
        description: "Enhance range of motion and reduce injury risk",
    },
    {
        id: "sports",
        name: "Sports Performance",
        icon: "⚽",
        description: "Enhance athletic abilities for specific sports",
    },
    {
        id: "body-recomp",
        name: "Body Recomposition",
        icon: "🔄",
        description: "Simultaneously build muscle and lose fat",
    },
    {
        id: "powerlifting",
        name: "Powerlifting",
        icon: "🏋️",
        description: "Focus on maximizing squat, bench press, and deadlift",
    },
    {
        id: "calisthenics",
        name: "Calisthenics",
        icon: "🤸‍♂️",
        description: "Master bodyweight exercises and movements",
    },
    {
        id: "general-health",
        name: "General Health",
        icon: "❤️",
        description: "Improve overall wellness and quality of life",
    },
];

export default function GoalSelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;

    const [selectedGoal, setSelectedGoal] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // If editing, fetch current goal
        if (isEditing) {
            const fetchCurrentGoal = async () => {
                try {
                    const response = await fetch("http://localhost:8000/workout/get-profile/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    const data = await response.json();
                    if (data.goal_selection) {
                        setSelectedGoal(data.goal_selection);
                    }
                } catch (error) {
                    console.error("Error fetching goal:", error);
                    toast.error("Failed to fetch current goal");
                }
            };
            fetchCurrentGoal();
        }
    }, [navigate, isEditing]);

    const handleSave = async () => {
        if (!selectedGoal) {
            toast.error("Please select a goal");
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
                body: JSON.stringify({ goal_selection: selectedGoal }),
            });

            if (response.ok) {
                toast.success("Goal saved successfully!");
                if (isEditing) {
                    navigate("/edit-preferences");
                } else {
                    navigate("/activity-level");
                }
            } else {
                toast.error("Failed to save goal. Please try again.");
            }
        } catch (error) {
            console.error("Error saving goal:", error);
            toast.error("Failed to save goal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-4 rounded-xl shadow-lg w-96 relative mt-5">
                <button 
                    onClick={() => isEditing ? navigate("/edit-preferences") : navigate(-1)}
                    className="absolute top-3 left-3 bg-white text-green-600 font-bold px-4 py-2 rounded-lg shadow-md border border-green-600 hover:bg-gray-100 transition"
                >
                    Back
                </button>

                <h2 className="text-xl font-bold mb-3 text-center mt-8">
                    Select Your Goal
                </h2>

                <div className="space-y-2">
                    {fitnessGoals.map((goal) => (
                        <button
                            key={goal.id}
                            className={`w-full p-3 text-left rounded-lg border transition ${
                                selectedGoal === goal.id
                                    ? "bg-green-100 border-green-500 text-green-700"
                                    : "border-gray-200 hover:border-green-300"
                            }`}
                            onClick={() => setSelectedGoal(goal.id)}
                        >
                            {goal.icon} {goal.name}
                            <p className="text-xs text-gray-500">{goal.description}</p>
                        </button>
                    ))}
                </div>

                <button
                    className="w-full mt-4 bg-white text-green-600 font-bold px-4 py-2 rounded-lg shadow-md border border-green-600 hover:bg-gray-100 transition"
                    onClick={handleSave}
                    disabled={!selectedGoal || loading}
                >
                    {loading ? "Saving..." : isEditing ? "Save Changes" : "Next"}
                </button>
            </div>
        </div>
    );
}
