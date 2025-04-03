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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-4 rounded-xl shadow-lg w-96 relative mt-5">
                <button 
                    onClick={() => isEditing ? navigate("/edit-preferences") : navigate(-1)}
                    className="absolute top-3 left-3 bg-white text-green-600 font-bold px-4 py-2 rounded-lg shadow-md border border-green-600 hover:bg-gray-100 transition"
                >
                    Back
                </button>

                <h2 className="text-xl font-bold mb-3 text-center mt-8">
                    BMI Calculator
                </h2>

                <label className="text-sm">Gender:</label>
                <select
                    className="w-full p-1 border rounded mb-2"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label className="text-sm">Height:</label>
                <div className="flex mb-2">
                    <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                    <select
                        className="ml-2 p-1 border rounded"
                        value={heightUnit}
                        onChange={(e) => setHeightUnit(e.target.value)}
                    >
                        <option value="cm">cm</option>
                        <option value="feet">feet</option>
                    </select>
                </div>

                <label className="text-sm">Weight:</label>
                <div className="flex mb-2">
                    <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                    <select
                        className="ml-2 p-1 border rounded"
                        value={weightUnit}
                        onChange={(e) => setWeightUnit(e.target.value)}
                    >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                    </select>
                </div>

                <label className="text-sm">Age:</label>
                <input
                    type="number"
                    className="w-full p-1 border rounded mb-2"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />

                <button
                    className="w-full bg-green-500 text-white p-2 rounded mt-3 hover:bg-green-700 transition mx-auto block"
                    onClick={calculateBMI}
                >
                    Calculate
                </button>

                {bmi && (
                    <div className="mt-3 text-center">
                        <p className="text-lg font-bold">BMI: {bmi}</p>
                        <p className="text-gray-600">{comment}</p>
                    </div>
                )}

                <button
                    className="w-full mt-4 bg-white text-green-600 font-bold px-4 py-2 rounded-lg shadow-md border border-green-600 hover:bg-gray-100 transition"
                    onClick={handleSave}
                    disabled={!bmi || loading}
                >
                    {loading ? "Saving..." : isEditing ? "Save Changes" : "Next"}
                </button>
            </div>
        </div>
    );
}
