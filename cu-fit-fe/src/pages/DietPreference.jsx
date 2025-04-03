import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const dietOptions = [
    { id: "veg", name: "Vegetarian", icon: "🥦" },
    { id: "non-veg", name: "Non-Vegetarian", icon: "🍗" },
    { id: "eggitarian", name: "Eggitarian", icon: "🍳" },
    { id: "mediterranean", name: "Mediterranean", icon: "🥗" },
    { id: "vegan", name: "Vegan", icon: "🌱" },
    { id: "detox", name: "Detox Diet", icon: "🍵" },
];

const DietPreference = () => {
    const [selectedDiet, setSelectedDiet] = useState(null);
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

        // If editing, fetch current diet preference
        if (isEditing) {
            const fetchCurrentPreference = async () => {
                try {
                    const response = await fetch("http://localhost:8000/workout/get-profile/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    const data = await response.json();
                    if (data.diet_preference) {
                        setSelectedDiet(data.diet_preference);
                    }
                } catch (error) {
                    console.error("Error fetching diet preference:", error);
                    toast.error("Failed to fetch current diet preference");
                }
            };
            fetchCurrentPreference();
        }
    }, [navigate, isEditing]);

    const handleDietSelect = (dietId) => {
        setSelectedDiet(dietId);
    };

    const handleNext = async () => {
        if (!selectedDiet) {
            toast.error("Please select a diet preference");
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
                body: JSON.stringify({ diet_preference: selectedDiet }),
            });

            if (response.ok) {
                toast.success("Diet preference saved successfully!");
                if (isEditing) {
                    navigate("/edit-preferences");
                } else {
                    navigate("/cooking-time");
                }
            } else {
                toast.error("Failed to save diet preference. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to save diet preference");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-green-600 mb-2">
                        Select Your Diet Preference
                    </h1>
                    <p className="text-gray-600">
                        Please choose one diet preference that best suits your lifestyle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dietOptions.map((diet) => (
                        <button
                            key={diet.id}
                            onClick={() => handleDietSelect(diet.id)}
                            className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                                ${selectedDiet === diet.id
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 bg-white hover:border-green-300"
                                }
                            `}
                        >
                            <div className="text-4xl mb-3">{diet.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {diet.name}
                            </h3>
                            <div
                                className={`w-full h-1 rounded-full mt-4 ${selectedDiet === diet.id ? "bg-green-500" : "bg-gray-200"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                {selectedDiet && (
                    <div className="mt-8 text-center">
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

export default DietPreference;
