import React, { useState } from "react";
import TextInput from "../components/shared/TextInput";

const Support = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (name) => (value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // const response = await makeAuthPOSTRequest("/support", formData);
            // Simulating a successful submission
            setSuccessMessage("Your message has been sent successfully!");
            setErrorMessage("");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Failed to send support request:", error);
            setErrorMessage("Failed to send your message. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="h-full w-full p-4 sm:p-8 overflow-auto">
            <div className="mb-8 sm:mb-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Support
                </h1>
                <p className="text-base sm:text-lg text-[#B0B0C0] mt-2">
                    Need help? Feel free to reach out to us.
                </p>
            </div>

            <div className="max-w-full sm:max-w-lg mx-auto bg-[#2D2D5E] p-4 sm:p-6 ml-0 rounded-lg shadow-lg">
                <TextInput
                    label="Name"
                    name="name"
                    value={formData.name}
                    setValue={handleInputChange("name")}
                    placeholder="Enter your name"
                    required
                />

                <TextInput
                    label="Email"
                    name="email"
                    className="my-4"
                    value={formData.email}
                    setValue={handleInputChange("email")}
                    placeholder="Enter your email"
                    required
                />

                <div className="mb-4">
                    <label
                        htmlFor="message"
                        className="block pl-1 text-white text-sm font-semibold mb-2"
                    >
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) =>
                            handleInputChange("message")(e.target.value)
                        }
                        rows="4"
                        className="w-full p-3 border border-[#B0B0C0] rounded-md bg-[#1A1A3B] text-white"
                        placeholder="Enter your message"
                        required
                    />
                </div>

                <div className="my-6 sm:my-8 border rounded-full"></div>

                {successMessage && (
                    <div className="mb-4 text-green-500">{successMessage}</div>
                )}
                {errorMessage && (
                    <div className="mb-4 text-red-500">{errorMessage}</div>
                )}

                <div className="mt-8 sm:mt-10">
                    <button
                        type="submit"
                        className="w-full p-3 border rounded-full bg-[#29B6F6] text-white font-semibold hover:bg-[#2D2D5E] hover:text-[#29B6F6] transition-colors duration-300"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
