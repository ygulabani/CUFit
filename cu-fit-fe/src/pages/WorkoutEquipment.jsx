import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

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

    // If editing, fetch current workout equipment
    if (isEditing) {
      const fetchCurrentEquipment = async () => {
        try {
          const response = await fetch("http://localhost:8000/workout/get-profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
          const data = await response.json();
          if (data.workout_equipment) {
            setSelectedEquipment(data.workout_equipment.split(","));
          }
        } catch (error) {
          console.error("Error fetching workout equipment:", error);
          toast.error("Failed to fetch current workout equipment");
        }
      };
      fetchCurrentEquipment();
    }
  }, [navigate, isEditing]);

  const handleEquipmentToggle = (equipment) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  const handleNext = async () => {
    if (selectedEquipment.length === 0) {
      toast.error("Please select at least one equipment");
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
          workout_equipment: selectedEquipment.join(","),
        }),
      });

      if (response.ok) {
        toast.success("Workout equipment saved successfully!");
        if (isEditing) {
          navigate("/edit-preferences");
        } else {
          navigate("/exercise-routine");
        }
      } else {
        toast.error("Failed to save workout equipment. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save workout equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Select Your Workout Equipment
          </h1>
          <p className="text-gray-600">
            Choose the equipment you have available for your workouts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "dumbbells", name: "Dumbbells", icon: "🏋️" },
            { id: "barbell", name: "Barbell", icon: "🏋️‍♂️" },
            { id: "kettlebell", name: "Kettlebell", icon: "🔔" },
            { id: "resistance_bands", name: "Resistance Bands", icon: "🎯" },
            { id: "yoga_mat", name: "Yoga Mat", icon: "🧘" },
            { id: "pull_up_bar", name: "Pull-up Bar", icon: "🏋️‍♀️" },
          ].map((equipment) => (
            <button
              key={equipment.id}
              onClick={() => handleEquipmentToggle(equipment.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                ${
                  selectedEquipment.includes(equipment.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300"
                }
                `}
            >
              <div className="text-4xl mb-3">{equipment.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {equipment.name}
              </h3>
              <div
                className={`w-full h-1 rounded-full mt-4 ${
                  selectedEquipment.includes(equipment.id) ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            </button>
          ))}
        </div>

        {selectedEquipment.length > 0 && (
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

export default WorkoutEquipment;
