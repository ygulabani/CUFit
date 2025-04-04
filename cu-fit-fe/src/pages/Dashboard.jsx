import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

  // Add welcome animation effect - only show once after login
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("hasSeenWelcome", "true");
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Get username from token and API
  useEffect(() => {
    const getUsername = async () => {
      if (!token) return;

      try {
        // First try to get username from token
        const decodedToken = jwtDecode(token);
        if (decodedToken.username) {
          setUsername(decodedToken.username);
          return;
        }

        // If not in token, try the API
        const response = await axios.get(
          "http://localhost:8000/auth/current-user/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.username) {
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error("Error getting username:", error);
        // Try profile endpoint as fallback
        try {
          const profileResponse = await axios.get(
            "http://localhost:8000/workout/get-profile/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (profileResponse.data && profileResponse.data.user && profileResponse.data.user.username) {
            setUsername(profileResponse.data.user.username);
          }
        } catch (profileError) {
          console.error("Error getting username from profile:", profileError);
        }
      }
    };

    getUsername();
  }, [token]);

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
            console.log("Meal plan response:", mealPlanResponse.data); // Debug log
            if (mealPlanResponse.data) {
              setMealPlan(mealPlanResponse.data);
            } else {
              setMealPlan({
                breakfast: [],
                lunch: [],
                dinner: [],
                snacks: [],
              });
            }
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
          navigate("/bmi-calculator");
        } else {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

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
        console.log("User has subscription:", data.selected_plan);
        setSubscriptionStatus(true);
      } else {
        console.log("User does not have a subscription");
        setSubscriptionStatus(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  // Reset welcome animation on logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hasSeenWelcome"); // Reset the welcome animation
    navigate("/login");
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
    <>
      {/* Welcome Animation Overlay */}
      {showWelcome && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600"
          style={{
            animation: 'fadeOut 1s ease-in-out 4s forwards'
          }}
        >
          <div 
            className="text-center"
            style={{
              animation: 'scaleUp 1s ease-out'
            }}
          >
            <div className="text-7xl mb-6 animate-bounce">👋</div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight animate-fade-in">
                Welcome
              </h1>
              <p className="text-3xl md:text-5xl text-green-50 font-medium capitalize animate-slide-up">
                {username}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Existing Dashboard Content */}
      <div className={`min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-8 relative transition-all duration-500 ${
        showWelcome ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-lg z-40 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-emerald-600">CU Fit</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/edit-preferences")}
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto space-y-6 pt-20">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { name: "Meal Around Campus", icon: "🍽️", path: "/meal-around-campus" },
              { name: "Exercises List", icon: "💪", path: "/exercises-list" },
              ...(subscriptionStatus ? [
                { name: "Master Workout", icon: "🏋️‍♂️", path: "/exercises-master" },
                { name: "My Workout Plan", icon: "📋", path: "/user-workout" },
                { name: "Your Meal Plan", icon: "🥗", path: "/user-meal-plan" }
              ] : [
                { name: "Get Premium", icon: "⭐", path: "/subscription" }
              ])
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700 transition-colors">{action.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Current Diet",
                value: userData.diet_selection || "Not set",
                icon: "🥑",
                color: "from-green-400 to-emerald-500"
              },
              {
                label: "Activity Level",
                value: userData.activity_level || "Not set",
                icon: "🏋️‍♀️",
                color: "from-blue-400 to-cyan-500"
              },
              {
                label: "Diet Preference",
                value: userData.diet_preference || "Not set",
                icon: "🍽️",
                color: "from-purple-400 to-pink-500"
              },
              {
                label: "Cooking Time",
                value: userData.cooking_time_preference || "Not set",
                icon: "⏳",
                color: "from-orange-400 to-amber-500"
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${stat.color}" />
                <div className="flex items-center space-x-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                  <div>
                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fitness Goals Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">🎯</span>
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Your Fitness Goals
                  </span>
                </h2>
              </div>
              <div className="flex items-center justify-center w-full">
                {userData.goal_selection ? (
                  <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl shadow-lg shadow-green-100 transform hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300">
                    <span className="text-2xl">✨</span>
                    <span className="text-lg font-medium">{userData.goal_selection}</span>
                    <span className="text-2xl">💪</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-50 text-gray-500 rounded-xl border border-gray-200 w-full max-w-md">
                    <span className="text-2xl">📝</span>
                    <span className="text-lg">No goals set yet</span>
                  </div>
                )}
              </div>
              {userData.goal_selection && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600 leading-relaxed">
                    Stay focused on your goal! We'll help you track your progress and adjust your workouts accordingly.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Meal Plan and Exercise Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meal Plan Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🍳</span>
                  Today's Meal Plan
                </h2>
              </div>
              <div className="space-y-4">
                {mealPlan ? (
                  Object.entries(mealPlan).map(([mealType, meals]) => {
                    if (!userData?.meal_plan_selection?.toLowerCase().includes(mealType.toLowerCase())) return null;
                    
                    return (
                      <div
                        key={mealType}
                        className="border-b border-gray-100 pb-4 last:border-0 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg p-3 transition-colors duration-300"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-gray-900 capitalize">{mealType}</h3>
                        </div>
                        <div className="text-sm text-gray-600">
                          {meals && meals.length > 0 ? (
                            meals.map((meal, index) => (
                              <div key={index} className="mb-1 hover:text-emerald-700 transition-colors">
                                {meal.name} - {meal.calories} calories
                                {meal.protein && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    (P: {meal.protein}g, C: {meal.carbs}g, F: {meal.fat}g)
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500 italic">No meals planned</div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No meal plan available. Please set up your meal preferences.
                  </div>
                )}
              </div>
            </div>

            {/* Exercise Routine Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">💪</span>
                  Exercise Routine
                </h2>
                <button
                  onClick={() => navigate("/user-workout")}
                  className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:scale-105"
                >
                  View Full Workout
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {workoutPlan?.exercises ? (
                  <div className="space-y-4">
                    {workoutPlan.exercises.slice(0, 5).map((exercise, index) => (
                      <div 
                        key={index} 
                        className="py-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg p-3 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 hover:text-emerald-700 transition-colors">
                              {exercise.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {exercise.body_part} - {exercise.exercise_type}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                            {exercise.difficulty}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center bg-white/50 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300">
                            <span className="text-gray-600">Sets: {exercise.sets}</span>
                          </div>
                          <div className="text-center bg-white/50 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300">
                            <span className="text-gray-600">Reps: {exercise.reps}</span>
                          </div>
                          <div className="text-center bg-white/50 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300">
                            <span className="text-gray-600">{exercise.duration} min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {workoutPlan.exercises.length > 5 && (
                      <div className="text-center pt-4">
                        <span className="text-sm text-emerald-600 font-medium">
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
                      className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors group"
                    >
                      Set up your workout plan 
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BMI Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">⚖️</span>
              BMI Information
            </h2>
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                {userData.bmi || "Not set"}
              </p>
            </div>
          </div>

          {/* Daily Stretching Section */}
          {userData.stretching_preference && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🧘‍♂️</span>
                  Daily Stretching Exercises
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Desk Neck Stretch",
                    duration: "20 seconds each side",
                    description: "Gently tilt your head towards each shoulder while sitting",
                    icon: "🪑",
                    videoId: "lf6eu8c8LL8",
                  },
                  {
                    name: "Seated Spinal Twist",
                    duration: "15 seconds each side",
                    description: "Twist your torso gently while seated, holding the chair for support",
                    icon: "🔄",
                    videoId: "6URMDkf2Uxk",
                  },
                  {
                    name: "Wrist & Finger Stretch",
                    duration: "30 seconds",
                    description: "Stretch your wrists and fingers to prevent typing strain",
                    icon: "✋",
                    videoId: "uPO-zST-7EE",
                  },
                  {
                    name: "Chair Shoulder Rolls",
                    duration: "30 seconds",
                    description: "Roll your shoulders backward and forward while seated",
                    icon: "💺",
                    videoId: "XbzY45Z5DE8",
                  },
                  {
                    name: "Seated Leg Extensions",
                    duration: "10 reps each leg",
                    description: "Extend your legs straight while sitting to stretch hamstrings",
                    icon: "🦵",
                    videoId: "8BcPHWGQO44",
                  },
                  {
                    name: "Standing Desk Stretch",
                    duration: "1 minute",
                    description: "Simple full-body stretch you can do at your standing desk",
                    icon: "🧍‍♂️",
                    videoId: "9N6ZQz-CV44",
                  },
                ].map((exercise, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedExercise(exercise)}
                    className="group bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">{exercise.icon}</span>
                      <h3 className="font-medium text-emerald-800 group-hover:text-emerald-600 transition-colors">
                        {exercise.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                      {exercise.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full group-hover:bg-emerald-200 transition-colors">
                        {exercise.duration}
                      </span>
                      <span className="text-xs text-emerald-600 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                        Watch video
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Modal */}
          {selectedExercise && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={() => setSelectedExercise(null)}
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>
              <div 
                className="relative bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl animate-scale-up z-10"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">{selectedExercise.icon}</span>
                    {selectedExercise.name}
                  </h3>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="relative pt-[56.25%] w-full rounded-xl overflow-hidden shadow-2xl">
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
                  <p className="text-sm text-emerald-600 mt-2 font-medium">
                    Duration: {selectedExercise.duration}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes scaleUp {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }

        .hover\:scale-up:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-scale-up {
          animation: scaleUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Dashboard;
