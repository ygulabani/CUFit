import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const profileResponse = await axios.get(
          "http://localhost:8000/workout/get-profile/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Set default values for missing data
        const defaultData = {
          diet_selection: "Not set",
          activity_level: "Not set",
          diet_preference: "Not set",
          cooking_time_preference: "Not set",
          goal_selection: "Not set",
          exercise_routine: "No exercise routine set",
          bmi: "Not set",
          stretching_preference: false,
          meal_plan_selection: "Not set",
        };

        // Merge profile data with defaults
        const completeProfileData = { ...defaultData, ...profileResponse.data };
        console.log("Profile data:", completeProfileData); // Debug log

        setUserData(completeProfileData);

        // Fetch meal plan if meal_plan_selection is set
        if (completeProfileData.meal_plan_selection !== "Not set") {
          try {
            const mealPlanResponse = await axios.get(
              "http://localhost:8000/meals/api/user-meal-plan/",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setMealPlan(mealPlanResponse.data);
          } catch (mealError) {
            console.error("Error fetching meal plan:", mealError);
            setMealPlan({
              breakfast: [],
              lunch: [],
              dinner: [],
              snacks: [],
            });
          }
        }

        // Fetch workout plan
        try {
          const workoutResponse = await axios.get(
            "http://localhost:8000/workout/api/user-workout/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (workoutResponse.data?.exercises) {
            setWorkoutPlan(workoutResponse.data);
            console.log("Workout data:", workoutResponse.data); // Debug log
          } else {
            setWorkoutPlan(null);
          }
        } catch (workoutError) {
          console.error("Error fetching workout plan:", workoutError);
          setWorkoutPlan(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 404) {
          navigate("/calender");
        } else {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    checkSubscription();
  }, [token, navigate]);

  const checkSubscription = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/check-subscription/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.has_subscription) {
        // User has an active subscription
        console.log("User has subscription:", data.selected_plan);
        setSubscriptionStatus(true);
      } else {
        // User doesn't have a subscription
        console.log("User does not have a subscription");
        setSubscriptionStatus(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">
          No user data available. Please complete your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
      {/* Logout and Navigation Buttons */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition font-semibold mt-2"
        >
          Logout
        </button>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => navigate("/meal-around-campus")}
            className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
          >
            Meal Around Campus
          </button>
          <button
            onClick={() => navigate("/exercises-list")}
            className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
          >
            Exercises List
          </button>
          {subscriptionStatus && (
            <button
              onClick={() => navigate("/exercises-master")}
              className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
            >
              Master Workout
            </button>
          )}
          {subscriptionStatus && (
            <button
              onClick={() => navigate("/user-workout")}
              className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
            >
              My Workout Plan
            </button>
          )}
          <button
            onClick={() => navigate("/edit-preferences")}
            className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
          >
            Edit Preferences
          </button>
          {subscriptionStatus && (
            <button
              onClick={() => navigate("/user-meal-plan")}
              className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
            >
              Your Meal-plan
            </button>
          )}
          {!subscriptionStatus && (
            <button
              onClick={() => navigate("/subscription")}
              className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
            >
              Subscription
            </button>
          )}
        </div>
      </div>
      <br></br>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Current Diet",
              value: userData.diet_selection || "Not set",
              icon: "🥑",
            },
            {
              label: "Activity Level",
              value: userData.activity_level || "Not set",
              icon: "🏋️‍♀️",
            },
            {
              label: "Diet Preference",
              value: userData.diet_preference || "Not set",
              icon: "🔥",
            },
            {
              label: "Cooking Time",
              value: userData.cooking_time_preference || "Not set",
              icon: "⏳",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fitness Goals Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Fitness Goals
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {userData.goal_selection || "Not set"}
            </span>
          </div>
        </div>

        {/* Meal Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Today's Meal Plan
              </h2>
            </div>
            <div className="space-y-4">
              {mealPlan &&
                Object.entries(mealPlan).map(([mealType, meals]) => {
                  // Check if this meal type is included in the user's meal plan selection
                  const isMealTypeIncluded = () => {
                    if (!userData?.meal_plan_selection) return false;
                    const selection =
                      userData.meal_plan_selection.toLowerCase();
                    return selection.includes(mealType.toLowerCase());
                  };

                  // Only render the meal section if it's included in the user's selection
                  if (!isMealTypeIncluded()) return null;

                  return (
                    <div
                      key={mealType}
                      className="border-b border-gray-100 pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {mealType}
                        </h3>
                      </div>
                      <div className="text-sm text-gray-600">
                        {meals.map((meal, index) => (
                          <div key={index} className="mb-1">
                            {meal.name} - {meal.calories} calories
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Exercise Routine */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Exercise Routine
              </h2>
              <button
                onClick={() => navigate("/user-workout")}
                className="text-sm bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                View Full Workout
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {workoutPlan?.exercises ? (
                <div className="space-y-4">
                  {/* Display a preview of exercises */}
                  {workoutPlan.exercises.slice(0, 5).map((exercise, index) => (
                    <div key={index} className="py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {exercise.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {exercise.body_part} - {exercise.exercise_type}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center bg-gray-50 rounded p-1">
                          <span className="text-gray-600">
                            Sets: {exercise.sets}
                          </span>
                        </div>
                        <div className="text-center bg-gray-50 rounded p-1">
                          <span className="text-gray-600">
                            Reps: {exercise.reps}
                          </span>
                        </div>
                        <div className="text-center bg-gray-50 rounded p-1">
                          <span className="text-gray-600">
                            {exercise.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {workoutPlan.exercises.length > 5 && (
                    <div className="text-center pt-4">
                      <span className="text-sm text-gray-500">
                        +{workoutPlan.exercises.length - 5} more exercises
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-3 text-center text-gray-500">
                  <p>No exercise routine set</p>
                  <button
                    onClick={() => navigate("/user-workout")}
                    className="mt-2 text-sm text-green-600 hover:text-green-700"
                  >
                    Set up your workout plan →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BMI Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            BMI Information
          </h2>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {userData.bmi || "Not set"}
            </p>
          </div>
        </div>

        {/* Debug stretching preference */}
        {console.log(
          "Rendering stretching section, value:",
          userData.stretching_preference
        )}

        {/* Daily Stretching Exercises */}
        {userData.stretching_preference && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Daily Stretching Exercises
              </h2>
              <span className="text-2xl">🧘‍♂️</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Desk Neck Stretch",
                  duration: "20 seconds each side",
                  description:
                    "Gently tilt your head towards each shoulder while sitting",
                  icon: "🪑",
                  videoId: "lf6eu8c8LL8",
                },
                {
                  name: "Seated Spinal Twist",
                  duration: "15 seconds each side",
                  description:
                    "Twist your torso gently while seated, holding the chair for support",
                  icon: "🔄",
                  videoId: "6URMDkf2Uxk",
                },
                {
                  name: "Wrist & Finger Stretch",
                  duration: "30 seconds",
                  description:
                    "Stretch your wrists and fingers to prevent typing strain",
                  icon: "✋",
                  videoId: "uPO-zST-7EE",
                },
                {
                  name: "Chair Shoulder Rolls",
                  duration: "30 seconds",
                  description:
                    "Roll your shoulders backward and forward while seated",
                  icon: "💺",
                  videoId: "XbzY45Z5DE8",
                },
                {
                  name: "Seated Leg Extensions",
                  duration: "10 reps each leg",
                  description:
                    "Extend your legs straight while sitting to stretch hamstrings",
                  icon: "🦵",
                  videoId: "8BcPHWGQO44",
                },
                {
                  name: "Standing Desk Stretch",
                  duration: "1 minute",
                  description:
                    "Simple full-body stretch you can do at your standing desk",
                  icon: "🧍‍♂️",
                  videoId: "9N6ZQz-CV44",
                },
              ].map((exercise, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-emerald-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{exercise.icon}</span>
                    <h3 className="font-medium text-emerald-800">
                      {exercise.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {exercise.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                      {exercise.duration}
                    </span>
                    <span className="text-xs text-emerald-600 hover:text-emerald-700">
                      Click to watch video ▶️
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedExercise.name}
                </h3>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="relative pt-[56.25%] w-full">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedExercise.videoId}`}
                  title={`${selectedExercise.name} demonstration`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">{selectedExercise.description}</p>
                <p className="text-sm text-emerald-600 mt-2">
                  Duration: {selectedExercise.duration}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
