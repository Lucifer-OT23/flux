import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeUnauthPOSTRequest } from "../utils/serverHelper";
import { useCookies } from "react-cookie";

import flux from "../assets/flux-white.png";
import TextInput from "../components/shared/TextInput";
import PassInput from "../components/shared/PassInput";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [cookies, setCookie] = useCookies(["token"]);

    const navigate = useNavigate();

    const login = async () => {
        const data = { email, password };

        try {
            const response = await makeUnauthPOSTRequest("/auth/login", data);

            if (response && response.token) {
                const token = response.token;

                // Set token in cookies
                const date = new Date();
                date.setDate(date.getDate() + 1);
                setCookie("token", token, { path: "/", expires: date });

                navigate("/home");
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="bg-[#1A1A3B] w-full h-screen flex flex-col items-center justify-center p-6">
            <div className="logo mb-8 border-b border-[#B0B0C0] pb-4">
                <img src={flux} alt="flux logo" width="150" />
            </div>
            <div className="inputRegion w-full max-w-md flex flex-col items-center">
                <p className="font-bold mb-4 text-2xl text-white">
                    Log in to Flux
                </p>

                {error && (
                    <div className="text-red-500 mb-4 text-sm">{error}</div> // Display error message
                )}

                <TextInput
                    type="text"
                    label="Email address or username"
                    placeholder="Email address or Username"
                    className="my-4"
                    value={email}
                    setValue={setEmail}
                />

                <PassInput
                    type="password"
                    label="Password"
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                />

                <button
                    className="bg-[#3C99DC] text-white text-lg font-semibold py-3 px-6 rounded-full mt-6 hover:bg-[#2a86d3] transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        login();
                    }}
                >
                    Log In
                </button>

                <div className="w-full border border-[#B0B0C0] my-6"></div>

                <p className="font-semibold text-lg text-white">
                    Don't have an account?
                </p>

                <div className="border border-[#B0B0C0] text-white w-full flex items-center justify-center py-4 rounded-full font-bold mt-4 cursor-pointer hover:bg-[#2a86d3] transition-colors">
                    <Link to="/signup" className="text-[#3C99DC]">
                        Sign Up for Flux
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
