import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const equipmentOptions = [
  { id: "dumbbells", name: "🏋️ Dumbbells" },
  { id: "barbell", name: "🏋️‍♂️ Barbell & Plates" },
  { id: "resistance-bands", name: "🟠 Resistance Bands" },
  { id: "kettlebell", name: "🏋️‍♀️ Kettlebell" },
  { id: "yoga-mat", name: "🧘 Yoga Mat" },
  { id: "pull-up-bar", name: "🏗️ Pull-Up Bar" },
  { id: "jump-rope", name: "🤾 Jump Rope" },
  { id: "treadmill", name: "🏃‍♂️ Treadmill" },
  { id: "exercise-bike", name: "🚴 Exercise Bike" },
  { id: "none", name: "🚫 No Equipment (Bodyweight Only)" },
];

const WorkoutEquipment = () => {
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    if (selectedEquipment.includes(id)) {
      setSelectedEquipment(selectedEquipment.filter((item) => item !== id));
    } else {
      setSelectedEquipment([...selectedEquipment, id]);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");  // Fetch token from localStorage
  
      if (!token) {
        alert("You're not logged in! Please log in first.");
        return;
      }
  
      const response = await axios.post(
        "http://127.0.0.1:8000/api/save-equipment/",
        { equipment: selectedEquipment },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Send token in the request
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Data saved successfully:", response.data);
      navigate("/exercise-routine"); // Move to next page
  
    } catch (error) {
      console.error("Error saving equipment:", error.response?.data || error);
      alert("Error: " + (error.response?.data?.error || "Something went wrong!"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">
            Select Your Available Workout Equipment
          </h1>
          <p className="text-gray-600">Choose all the equipment you have at home.</p>
        </div>

        {/* Equipment Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipmentOptions.map((equipment) => (
            <button
              key={equipment.id}
              onClick={() => handleSelect(equipment.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg text-left flex items-center gap-3
                ${
                  selectedEquipment.includes(equipment.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300"
                }`}
            >
              <span className="text-2xl">{equipment.name.split(" ")[0]}</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {equipment.name.split(" ").slice(1).join(" ")}
              </h3>
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate("/previous-page")}
            className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              selectedEquipment.length > 0
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedEquipment.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutEquipment;
