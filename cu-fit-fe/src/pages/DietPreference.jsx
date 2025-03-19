import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const handleDietSelect = (dietId) => {
        setSelectedDiet(dietId);
    };

    const handleNext = async () => {
        try {
            await fetch("http://localhost:8000/update-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ diet_preference: selectedDiet }),
            });
            navigate("/cooking-time");
        } catch (error) {
            console.error("Error updating profile:", error);
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
                            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DietPreference;
