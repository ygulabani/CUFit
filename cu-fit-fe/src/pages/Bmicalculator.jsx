import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function BMICalculator() {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;

    const [gender, setGender] = useState("male");
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [age, setAge] = useState(0);
    const [heightUnit, setHeightUnit] = useState("cm");
    const [weightUnit, setWeightUnit] = useState("kg");
    const [bmi, setBmi] = useState(null);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // If editing, fetch current BMI data
        if (isEditing) {
            const fetchCurrentBMI = async () => {
                try {
                    const response = await fetch("http://localhost:8000/workout/get-profile/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    const data = await response.json();
                    if (data.bmi) {
                        setBmi(data.bmi);
                        if (data.height) setHeight(data.height);
                        if (data.weight) setWeight(data.weight);
                        
                        // Set BMI comment based on current value
                        const bmiValue = parseFloat(data.bmi);
                        if (bmiValue < 18.5) setComment("Underweight");
                        else if (bmiValue < 24.9) setComment("Normal weight");
                        else if (bmiValue < 29.9) setComment("Overweight");
                        else setComment("Obese");
                    }
                } catch (error) {
                    console.error("Error fetching BMI:", error);
                    toast.error("Failed to fetch current BMI");
                }
            };
            fetchCurrentBMI();
        }
    }, [navigate, isEditing]);

    const calculateBMI = () => {
        let heightInMeters = heightUnit === "cm" ? height / 100 : height * 0.3048;
        let weightInKg = weightUnit === "kg" ? weight : weight * 0.453592;
        let bmiValue = weightInKg / (heightInMeters * heightInMeters);
        setBmi(bmiValue.toFixed(2));

        if (bmiValue < 18.5) setComment("Underweight");
        else if (bmiValue < 24.9) setComment("Normal weight");
        else if (bmiValue < 29.9) setComment("Overweight");
        else setComment("Obese");
    };

    const handleSave = async () => {
        if (!bmi) {
            toast.error("Please calculate BMI first");
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
                    bmi: bmi,
                    height: height,
                    weight: weight
                }),
            });

            if (response.ok) {
                toast.success("BMI saved successfully!");
                if (isEditing) {
                    navigate("/edit-preferences");
                } else {
                    navigate("/goal-selection");
                }
            } else {
                toast.error("Failed to save BMI. Please try again.");
            }
        } catch (error) {
            console.error("Error saving BMI:", error);
            toast.error("Failed to save BMI");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
                <button 
                    onClick={() => isEditing ? navigate("/edit-preferences") : navigate(-1)}
                    className="absolute top-4 left-4 bg-white text-green-600 font-semibold px-4 py-2 rounded-lg shadow-sm border border-green-200 hover:bg-green-50 transition"
                >
                    ← Back
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-green-600 mb-2">
                    BMI Calculator
                </h2>
                    <p className="text-gray-600">Calculate your Body Mass Index</p>
                </div>

                <div className="space-y-6">
                    {/* Gender Selection */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setGender("male")}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                gender === "male"
                                    ? "bg-green-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Male
                        </button>
                        <button
                            onClick={() => setGender("female")}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                gender === "female"
                                    ? "bg-green-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Female
                        </button>
                    </div>

                    {/* Height Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Height</label>
                        <div className="flex gap-2">
                    <input
                        type="number"
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                                placeholder="Enter height"
                    />
                    <select
                                className="w-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={heightUnit}
                        onChange={(e) => setHeightUnit(e.target.value)}
                    >
                        <option value="cm">cm</option>
                        <option value="feet">feet</option>
                    </select>
                        </div>
                </div>

                    {/* Weight Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Weight</label>
                        <div className="flex gap-2">
                    <input
                        type="number"
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                                placeholder="Enter weight"
                    />
                    <select
                                className="w-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={weightUnit}
                        onChange={(e) => setWeightUnit(e.target.value)}
                    >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                    </select>
                        </div>
                </div>

                    {/* Age Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Age</label>
                <input
                    type="number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                            placeholder="Enter age"
                />
                    </div>

                    {/* Calculate Button */}
                <button
                        className="w-full bg-green-500 text-white p-4 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                    onClick={calculateBMI}
                >
                        Calculate BMI
                </button>

                    {/* BMI Result */}
                {bmi && (
                        <div className="mt-6 p-6 bg-green-50 rounded-lg text-center">
                            <p className="text-4xl font-bold text-green-600 mb-2">{bmi}</p>
                            <p className="text-lg font-medium text-gray-700">{comment}</p>
                            <div className="mt-4">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-green-500 transition-all duration-500"
                                        style={{ 
                                            width: `${Math.min(100, (parseFloat(bmi) / 50) * 100)}%` 
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Underweight</span>
                                    <span>Normal</span>
                                    <span>Overweight</span>
                                    <span>Obese</span>
                                </div>
                            </div>
                    </div>
                )}

                    {/* Save Button */}
                <button
                        className="w-full mt-4 bg-white text-green-600 font-semibold px-4 py-3 rounded-lg shadow-sm border border-green-200 hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={!bmi || loading}
                >
                    {loading ? "Saving..." : isEditing ? "Save Changes" : "Next"}
                </button>
                </div>
            </div>
        </div>
    );
}
