import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Welcome to CU Fit
          </h1>
          <p className="text-xl text-gray-600">
            Your personal journey to a healthier lifestyle starts here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Track Workouts
            </h2>
            <p className="text-gray-600">
              Log and monitor your daily exercise routines
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Nutrition Guide
            </h2>
            <p className="text-gray-600">
              Access healthy meal plans and nutrition tips
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Health Metrics
            </h2>
            <p className="text-gray-600">
              Monitor your progress and vital statistics
            </p>
          </div>
        </div>

        <div className="text-center bg-green-500 text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="mb-6">
            Join CU Fit today and transform your life with our comprehensive
            health tracking tools
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-green-500 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
