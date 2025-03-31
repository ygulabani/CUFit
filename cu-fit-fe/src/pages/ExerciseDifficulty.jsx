import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const difficulties = [
    {
        id: "beginner",
        name: "Beginner",
        icon: "🌱",
        description: "Perfect for those new to exercise or returning after a break",
        examples: "Basic movements, Light weights, Bodyweight exercises"
    },
    {
        id: "intermediate",
        name: "Intermediate",
        icon: "🌿",
        description: "For those with some experience and looking to challenge themselves",
        examples: "Complex movements, Moderate weights, Circuit training"
    },
    {
        id: "advanced",
        name: "Advanced",
        icon: "🌳",
        description: "Intensive workouts for experienced fitness enthusiasts",
        examples: "Advanced techniques, Heavy weights, High-intensity training"
    }
];

const ExerciseDifficulty = () => {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState(null);

    const handleLevelSelect = (levelId) => {
        setSelectedLevel(levelId);
    };

    const handleNext = async () => {
        if (!selectedLevel) {
            toast.error("Please select a difficulty level before proceeding.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8000/exercise-difficulty/',
                { difficulty: selectedLevel },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Exercise difficulty saved successfully!');
                navigate('/workout-equipment');
            }
        } catch (error) {
            console.error('Error saving exercise difficulty:', error);
            toast.error('Failed to save exercise difficulty. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Select Your Exercise Difficulty
                    </h1>
                    <p className="text-gray-600">
                        Choose the level that best matches your fitness experience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {difficulties.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => handleLevelSelect(level.id)}
                            className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                                ${selectedLevel === level.id
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-green-200'
                                }
                            `}
                        >
                            <div className="text-4xl mb-3">{level.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {level.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                {level.description}
                            </p>
                            <p className="text-xs text-gray-500 italic">
                                Examples: {level.examples}
                            </p>
                            <div className={`w-full h-1 rounded-full mt-4 ${
                                selectedLevel === level.id ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                        </button>
                    ))}
                </div>

                {selectedLevel && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleNext}
                            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold
                                hover:bg-green-600 transition-colors duration-200"
                        >
                            Continue with {difficulties.find(l => l.id === selectedLevel)?.name}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseDifficulty; 