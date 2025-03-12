import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove authentication token
    navigate("/login"); // Redirect to login page
  };

  // Example user data
  const userPlan = {
    name: "John Doe",
    diet: "Keto",
    goals: ["Build Muscle", "Increase Strength", "Body Recomposition"],
    activityLevel: "Very Active",
    dailyCalories: 2800,
    waterIntake: "4L",
    currentWeight: "75kg",
    targetWeight: "82kg",
    todaysMeals: {
      breakfast: {
        time: "8:00 AM",
        items: ["Eggs & Bacon", "Avocado"],
        calories: 650,
      },
      lunch: {
        time: "1:00 PM",
        items: ["Grilled Chicken", "Spinach Salad"],
        calories: 750,
      },
      dinner: {
        time: "7:00 PM",
        items: ["Salmon", "Cauliflower Rice"],
        calories: 600,
      },
      snacks: {
        time: "Various",
        items: ["Protein Shake", "Nuts"],
        calories: 400,
      },
    },
    todaysWorkout: [
      { name: "Bench Press", sets: "4x10", weight: "80kg" },
      { name: "Squats", sets: "4x8", weight: "100kg" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
      {/* Logout and Meal Around Campus Buttons */}
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
          <button
            onClick={() => navigate("/exercises-master")}
            className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition font-semibold"
          >
            Master Workout
          </button>
        </div>
      </div>
      <br></br>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Current Diet", value: userPlan.diet, icon: "🥑" },
            {
              label: "Activity Level",
              value: userPlan.activityLevel,
              icon: "🏋️‍♀️",
            },
            {
              label: "Daily Calories",
              value: `${userPlan.dailyCalories} kcal`,
              icon: "🔥",
            },
            { label: "Water Goal", value: userPlan.waterIntake, icon: "💧" },
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
            {userPlan.goals.map((goal, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>

        {/* Meal Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Today's Keto Meals
              </h2>
              <span className="text-sm text-green-600 font-medium">
                {Object.values(userPlan.todaysMeals).reduce(
                  (acc, meal) => acc + meal.calories,
                  0
                )}{" "}
                kcal total
              </span>
            </div>
            <div className="space-y-4">
              {Object.entries(userPlan.todaysMeals).map(([meal, data]) => (
                <div
                  key={meal}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {meal}
                    </h3>
                    <span className="text-sm text-gray-500">{data.time}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {data.items.join(", ")}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {data.calories} calories
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workout Plan */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Today's Strength Training
            </h2>
            <div className="divide-y divide-gray-100">
              {userPlan.todaysWorkout.map((exercise, index) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {exercise.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {exercise.sets}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Weight: {exercise.weight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Weight Progress
          </h2>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-sm text-gray-500">Current</p>
              <p className="text-2xl font-bold text-green-600">
                {userPlan.currentWeight}
              </p>
            </div>
            <div className="text-green-500">→</div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Target</p>
              <p className="text-2xl font-bold text-green-600">
                {userPlan.targetWeight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// TODO: update later
// import { useEffect, useState } from "react";

// const Dashboard = () => {
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             const token = localStorage.getItem("authToken");
//             if (!token) {
//                 setError("User not authenticated. Please log in.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await fetch("http://localhost:8000/get-profile/", {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Token ${token}`,
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch user data");
//                 }

//                 const data = await response.json();
//                 setUserData(data);
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//                 setError("Failed to load data. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserData();
//     }, []);

//     if (loading) return <p className="text-center text-gray-600">Loading...</p>;
//     if (error) return <p className="text-center text-red-600">{error}</p>;
//     if (!userData) return <p className="text-center text-red-600">No user data found.</p>;

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-8">
//             <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
//                 <h1 className="text-3xl font-bold text-green-600 text-center">
//                     Hello, {userData.username} 👋
//                 </h1>
//                 <p className="text-center text-gray-600 mb-6">
//                     Here's a summary of your fitness journey!
//                 </p>

//                 <div className="space-y-4">
//                     {[
//                         ["Your Goals 🎯", "goal_selection"],
//                         ["Diet Selection 🍽️", "diet_selection"],
//                         ["Diet Preference 🌱", "diet_preference"],
//                         ["Cooking Time ⏳", "cooking_time"],
//                         ["Meal Plan 🍛", "meal_plan_selection"],
//                         ["Activity Level 🏃‍♂️", "activity_level"],
//                         ["Exercise Routine 💪", "exercise_routine"],
//                         ["Pain & Injury 🚑", "pain_and_injury"],
//                     ].map(([title, key]) => (
//                         <div key={key} className="border-b pb-4">
//                             <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
//                             <p className="text-gray-600">{userData[key] || "Not selected"}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
