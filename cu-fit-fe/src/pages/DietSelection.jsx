import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const dietTypes = [
    {
        id: "balanced",
        name: "Balanced Diet",
        icon: "🥗",
        description: "A well-rounded diet with all food groups"
    },
    {
        id: "vegetarian",
        name: "Vegetarian",
        icon: "🥬",
        description: "No meat, includes dairy and eggs"
    },
    {
        id: "vegan",
        name: "Vegan",
        icon: "🌱",
        description: "Plant-based diet, no animal products"
    },
    {
        id: "keto",
        name: "Ketogenic",
        icon: "🥑",
        description: "High-fat, low-carb diet"
    },
    {
        id: "paleo",
        name: "Paleo",
        icon: "🥩",
        description: "Based on foods available to our ancestors"
    },
    {
        id: "mediterranean",
        name: "Mediterranean",
        icon: "🐟",
        description: "Rich in fruits, vegetables, and healthy fats"
    }
];

export default function DietSelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;

    const [selectedDiet, setSelectedDiet] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // If editing, fetch current diet
        if (isEditing) {
            const fetchCurrentDiet = async () => {
                try {
                    const response = await fetch("http://localhost:8000/workout/get-profile/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    const data = await response.json();
                    if (data.diet_selection) {
                        setSelectedDiet(data.diet_selection);
                    }
                } catch (error) {
                    console.error("Error fetching diet:", error);
                    toast.error("Failed to fetch current diet");
                }
            };
            fetchCurrentDiet();
        }
    }, [navigate, isEditing]);

    const handleSave = async () => {
        if (!selectedDiet) {
            toast.error("Please select a diet type");
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
                body: JSON.stringify({ diet_selection: selectedDiet }),
            });

            if (response.ok) {
                toast.success("Diet preference saved successfully!");
                if (isEditing) {
                    navigate("/edit-preferences");
                } else {
                    navigate("/diet-preference");
                }
            } else {
                toast.error("Failed to save diet preference. Please try again.");
            }
        } catch (error) {
            console.error("Error saving diet:", error);
            toast.error("Failed to save diet preference");
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
                    Select Your Diet Type
                </h2>

                <div className="space-y-2">
                    {dietTypes.map((diet) => (
                        <button
                            key={diet.id}
                            className={`w-full p-3 text-left rounded-lg border transition ${
                                selectedDiet === diet.id
                                    ? "bg-green-100 border-green-500 text-green-700"
                                    : "border-gray-200 hover:border-green-300"
                            }`}
                            onClick={() => setSelectedDiet(diet.id)}
                        >
                            <div className="flex items-center">
                                <span className="text-xl mr-2">{diet.icon}</span>
                                <div>
                                    <div className="font-medium">{diet.name}</div>
                                    <div className="text-xs text-gray-500">{diet.description}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    className="w-full mt-4 bg-white text-green-600 font-bold px-4 py-2 rounded-lg shadow-md border border-green-600 hover:bg-gray-100 transition"
                    onClick={handleSave}
                    disabled={!selectedDiet || loading}
                >
                    {loading ? "Saving..." : isEditing ? "Save Changes" : "Next"}
                </button>
            </div>
        </div>
    );
}
