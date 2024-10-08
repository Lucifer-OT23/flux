import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeUnauthPOSTRequest } from "../utils/serverHelper";
import { useCookies } from "react-cookie";

import flux from "../../public/flux2-white.svg";
import TextInput from "../components/shared/TextInput";
import PassInput from "../components/shared/PassInput";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [cookie, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();

    const signUp = async () => {
        if (email !== confirmEmail) {
            setError("Email addresses do not match!");
            setSuccess("");
            return;
        }

        const data = {
            email,
            username,
            password,
            firstName,
            lastName,
        };

        try {
            const response = await makeUnauthPOSTRequest(
                "/auth/register",
                data
            );
            if (response && !response.err) {
                const token = response.token;

                const date = new Date();
                date.setDate(date.getDate() + 1);

                setCookie("token", token, { path: "/", expires: date });

                setSuccess("Sign up successful! Redirecting...");
                setError("");

                setTimeout(() => {
                    navigate("/home");
                }, 1000);
            } else {
                setError("Sign up failed. Please try again.");
                setSuccess("");
            }
        } catch (err) {
            console.error("Sign up error:", err);
            setError("An error occurred. Please try again.");
            setSuccess("");
        }
    };

    return (
        <div className="bg-[#1A1A3B] w-full min-h-screen flex flex-col items-center p-6">
            <div className="logo mb-8 border-b border-[#B0B0C0] pb-4">
                <img src={flux} alt="flux logo" width="150" />
            </div>

            <div className="inputRegion w-full max-w-md flex flex-col items-center">
                <div className="font-bold mb-6 text-2xl text-white text-center">
                    Sign up for free to start listening.
                </div>

                {error && (
                    <div className="text-red-500 mb-4 text-sm">{error}</div>
                )}
                {success && (
                    <div className="text-green-500 mb-4 text-sm">{success}</div>
                )}

                <TextInput
                    label="Email address"
                    placeholder="Enter your email"
                    className="my-4"
                    value={email}
                    setValue={setEmail}
                />

                <TextInput
                    label="Confirm Email Address"
                    placeholder="Enter your email again"
                    className="my-4"
                    value={confirmEmail}
                    setValue={setConfirmEmail}
                />

                <TextInput
                    label="Username"
                    placeholder="Enter your username"
                    className="my-4"
                    value={username}
                    setValue={setUsername}
                />

                <PassInput
                    label="Create Password"
                    placeholder="Enter a strong password"
                    value={password}
                    setValue={setPassword}
                    className="my-4"
                />

                <div className="w-full flex flex-wrap gap-4 mb-8 my-4">
                    <TextInput
                        label="First Name"
                        placeholder="Enter Your First Name"
                        value={firstName}
                        setValue={setFirstName}
                        className="flex-1 min-w-[200px]"
                    />

                    <TextInput
                        label="Last Name"
                        placeholder="Enter Your Last Name"
                        value={lastName}
                        setValue={setLastName}
                        className="flex-1 min-w-[200px]"
                    />
                </div>

                <button
                    className="bg-[#3C99DC] text-white font-semibold py-3 px-8 rounded-full mb-6"
                    onClick={(e) => {
                        e.preventDefault();
                        signUp();
                    }}
                >
                    Sign Up
                </button>

                <div className="w-full border border-[#B0B0C0] rounded-full mb-6"></div>

                <p className="font-semibold text-lg text-white mb-6 text-center">
                    Already have an account?
                </p>

                <div className="border border-[#B0B0C0] text-[#3C99DC] w-full flex items-center justify-center py-4 rounded-full font-bold mt-4 cursor-pointer hover:bg-[#2a86d3] hover:text-white transition-colors">
                    <Link to="/login">LOG IN INSTEAD</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
