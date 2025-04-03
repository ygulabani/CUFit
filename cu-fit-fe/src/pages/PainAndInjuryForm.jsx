import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const painAreas = ["Knees", "Shoulders", "Back", "Ankles", "Hips", "Neck"];
const injuriesList = [
  "Muscle Strain",
  "Ligament Tear",
  "Fracture",
  "Tendonitis",
  "Dislocation",
  "None",
];
const surgeriesList = [
  "Knee Surgery",
  "Shoulder Surgery",
  "Back Surgery",
  "Ankle Surgery",
  "Hip Replacement",
  "None",
];
const motionLimitationsList = [
  "Difficulty Bending",
  "Limited Arm Movement",
  "Restricted Neck Rotation",
  "Limited Ankle Mobility",
  "None",
];
const medicalConditions = [
  "Arthritis",
  "Osteoporosis",
  "Heart Disease",
  "Diabetes",
  "Asthma",
  "Hypertension",
  "None",
];

const PainAndInjuryForm = () => {
  const [selectedPainAreas, setSelectedPainAreas] = useState([]);
  const [selectedInjuries, setSelectedInjuries] = useState([]);
  const [selectedSurgeries, setSelectedSurgeries] = useState([]);
  const [selectedMotionLimitations, setSelectedMotionLimitations] = useState(
    []
  );
  const [selectedMedicalCondition, setSelectedMedicalCondition] =
    useState("None");
  const [painLevel, setPainLevel] = useState(0);
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

    // If editing, fetch current pain and injury data
    if (isEditing) {
      const fetchCurrentData = async () => {
        try {
          const response = await fetch("http://localhost:8000/workout/get-profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
          const data = await response.json();
          if (data.pain_and_injury) {
            // Parse the pain and injury data from the string
            const painAndInjuryData = data.pain_and_injury.split(", ");
            
            // Reset all selections
            setSelectedPainAreas([]);
            setSelectedInjuries([]);
            setSelectedSurgeries([]);
            setSelectedMotionLimitations([]);
            setSelectedMedicalCondition("None");
            setPainLevel(0);
            
            // Process each item in the pain and injury data
            painAndInjuryData.forEach(item => {
              if (painAreas.includes(item)) {
                setSelectedPainAreas(prev => [...prev, item]);
              } else if (injuriesList.includes(item)) {
                setSelectedInjuries(prev => [...prev, item]);
              } else if (surgeriesList.includes(item)) {
                setSelectedSurgeries(prev => [...prev, item]);
              } else if (motionLimitationsList.includes(item)) {
                setSelectedMotionLimitations(prev => [...prev, item]);
              } else if (medicalConditions.includes(item)) {
                setSelectedMedicalCondition(item);
              } else if (item.startsWith("Pain Level: ")) {
                const level = parseInt(item.replace("Pain Level: ", ""));
                if (!isNaN(level)) {
                  setPainLevel(level);
                }
              }
            });
          }
        } catch (error) {
          console.error("Error fetching pain and injury data:", error);
          toast.error("Failed to fetch current pain and injury data");
        }
      };
      fetchCurrentData();
    }
  }, [navigate, isEditing]);

  const handleToggle = (selectedList, setSelectedList, item) => {
    setSelectedList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const pain_and_injury = [
        ...selectedPainAreas,
        ...selectedInjuries,
        ...selectedSurgeries,
        ...selectedMotionLimitations,
        selectedMedicalCondition,
        `Pain Level: ${painLevel}`,
      ].join(", ");

      const response = await fetch("http://localhost:8000/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          pain_and_injury,
        }),
      });

      if (response.ok) {
        toast.success("Pain and injury information saved successfully!");
        if (isEditing) {
          navigate("/edit-preferences");
        } else {
          navigate("/stretching-preference");
        }
      } else {
        toast.error("Failed to save pain and injury information. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save pain and injury information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8 md:p-10 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-800/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2 tracking-tight">
              Pain & Injury Information
            </h2>
            <p className="text-green-50 text-center text-sm sm:text-base md:text-lg">
              Help us customize your workout plan by sharing any pain or injuries
            </p>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            {/* Pain Areas */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Areas of Pain
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {painAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() =>
                      handleToggle(selectedPainAreas, setSelectedPainAreas, area)
                    }
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      selectedPainAreas.includes(area)
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Injuries */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Current Injuries or Limitations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {injuriesList.map((injury) => (
                  <button
                    key={injury}
                    onClick={() =>
                      handleToggle(selectedInjuries, setSelectedInjuries, injury)
                    }
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      selectedInjuries.includes(injury)
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    {injury}
                  </button>
                ))}
              </div>
            </div>

            {/* Surgeries */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Surgeries
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {surgeriesList.map((surgery) => (
                  <button
                    key={surgery}
                    onClick={() =>
                      handleToggle(selectedSurgeries, setSelectedSurgeries, surgery)
                    }
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      selectedSurgeries.includes(surgery)
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    {surgery}
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Limitations */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Range of Motion Limitations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {motionLimitationsList.map((limitation) => (
                  <button
                    key={limitation}
                    onClick={() =>
                      handleToggle(
                        selectedMotionLimitations,
                        setSelectedMotionLimitations,
                        limitation
                      )
                    }
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      selectedMotionLimitations.includes(limitation)
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    {limitation}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Medical Conditions
              </h3>
              <select
                value={selectedMedicalCondition}
                onChange={(e) => setSelectedMedicalCondition(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {medicalConditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Pain Level */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Pain Level During Movement
              </h3>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(e.target.value)}
                className="w-full"
              />
              <p className="text-gray-600 text-center mt-2">
                Pain Level: {painLevel}/10
              </p>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleNext}
                disabled={loading}
                className={`group relative px-8 py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 transform ${
                  loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-2xl hover:shadow-green-200 hover:scale-[1.02]"
                }`}
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isEditing ? "Save Changes" : "Next"}
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainAndInjuryForm;
