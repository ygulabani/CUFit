import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleToggle = (selectedList, setSelectedList, item) => {
    setSelectedList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleNext = async () => {
    try {
      const pain_and_injury = [
        ...selectedPainAreas,
        ...selectedInjuries,
        ...selectedSurgeries,
        ...selectedMotionLimitations,
        selectedMedicalCondition,
        `Pain Level: ${painLevel}`,
      ].join(", ");

      await fetch("http://localhost:8000/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          pain_and_injury,
        }),
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">
            Injury & Pain Assessment
          </h1>
          <p className="text-gray-600">
            Tell us about your pain, injuries, and limitations.
          </p>
        </div>

        {/* Pain Areas */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Areas of Pain
          </h2>
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Current Injuries or Limitations
          </h2>
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Recent Surgeries
          </h2>
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Range of Motion Limitations
          </h2>
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Medical Conditions
          </h2>
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Pain Level During Movement
          </h2>
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

        {/* Next Button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PainAndInjuryForm;
