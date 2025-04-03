import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const ExerciseDifficulty = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
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

    // If editing, fetch current exercise difficulty
    if (isEditing) {
      const fetchCurrentDifficulty = async () => {
        try {
          const response = await fetch("http://localhost:8000/workout/get-profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
          const data = await response.json();
          if (data.exercise_difficulty) {
            setSelectedDifficulty(data.exercise_difficulty);
          }
        } catch (error) {
          console.error("Error fetching exercise difficulty:", error);
          toast.error("Failed to fetch current exercise difficulty");
        }
      };
      fetchCurrentDifficulty();
    }
  }, [navigate, isEditing]);

  const handleNext = async () => {
    if (!selectedDifficulty) {
      toast.error("Please select a difficulty level");
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
          exercise_difficulty: selectedDifficulty,
        }),
      });

      if (response.ok) {
        toast.success("Exercise difficulty saved successfully!");
        if (isEditing) {
          navigate("/edit-preferences");
        } else {
          navigate("/exercise-routine");
        }
      } else {
        toast.error("Failed to save exercise difficulty. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save exercise difficulty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Select Your Exercise Difficulty
          </h1>
          <p className="text-gray-600">
            Choose a difficulty level that matches your fitness level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "beginner", name: "Beginner", icon: "🌱" },
            { id: "intermediate", name: "Intermediate", icon: "🌿" },
            { id: "advanced", name: "Advanced", icon: "🌳" },
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedDifficulty(level.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                ${
                  selectedDifficulty === level.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300"
                }
                `}
            >
              <div className="text-4xl mb-3">{level.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {level.name}
              </h3>
              <div
                className={`w-full h-1 rounded-full mt-4 ${
                  selectedDifficulty === level.id ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            </button>
          ))}
        </div>

        {selectedDifficulty && (
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

export default ExerciseDifficulty; 