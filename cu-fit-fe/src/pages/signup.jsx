import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const API_BASE_URL = "http://localhost:8000";
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        general: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateInputs = () => {
        const newErrors = { username: "", email: "", password: "", general: "" };
        let isValid = true;

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        } else if (formData.username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters";
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({ username: "", email: "", password: "", general: "" });

        if (!validateInputs()) {
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/signup/`, formData);
            navigate("/login");
        } catch (error) {
            handleSignupError(error);
        }
    };

    const handleSignupError = (error) => {
        if (error.response?.data) {
            const serverErrors = error.response.data;
            setErrors({
                username: serverErrors.username?.[0] || "",
                email: serverErrors.email?.[0] || "",
                password: serverErrors.password?.[0] || "",
                general: "Please correct the errors and try again.",
            });
        } else if (error.request) {
            setErrors((prev) => ({
                ...prev,
                general: "Unable to connect to the server. Please try again later.",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                general: "An unexpected error occurred. Please try again.",
            }));
        }
    };

    return (
        <>
            <div className="absolute top-4 left-4">
                <a
                    href="/"
                    className="text-2xl font-bold text-green-600 hover:text-green-800"
                >
                    Cufit
                </a>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                    <h1 className="text-2xl font-bold text-center">Sign Up</h1>

                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className={`mt-1 block w-full rounded-md border px-3 py-2 ${errors.username ? "border-red-500" : "border-gray-300"
                                    } focus:border-green-500 focus:outline-none`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`mt-1 block w-full rounded-md border px-3 py-2 ${errors.email ? "border-red-500" : "border-gray-300"
                                    } focus:border-green-500 focus:outline-none`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`mt-1 block w-full rounded-md border px-3 py-2 ${errors.password ? "border-red-500" : "border-gray-300"
                                    } focus:border-green-500 focus:outline-none`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <a
                            href="/login"
                            className="text-sm text-green-600 hover:text-green-800"
                        >
                            Already have an account? Log in
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;