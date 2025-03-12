import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const API_BASE_URL = "http://localhost:8000";
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateInputs = () => {
        const newErrors = { username: "", password: "" };
        let isValid = true;

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        } else if (formData.username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters";
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

        if (!validateInputs()) {
            setErrorMessage("Please fix the errors before submitting.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/login/`, formData);
            console.log("Login Success:", response.data);
            setErrorMessage("");
            localStorage.setItem("authToken", response.data.access_token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login Error:", error);
            setErrorMessage("Login failed. Please check your credentials.");
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
                    <h1 className="text-2xl font-bold text-center">Login</h1>
                    {errorMessage && (
                        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
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
                                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none ${errors.username
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-green-500"
                                    }`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
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
                                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none ${errors.password
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-green-500"
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Login
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a
                                href="/signup"
                                className="font-medium text-green-600 hover:text-green-500"
                            >
                                Create one here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

