import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeAuthPOSTRequest } from "../utils/serverHelper";
import TextInput from "../components/shared/TextInput";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";

const UploadSong = () => {
    const [name, setName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [trackUrl, setTrackUrl] = useState("");
    const [uploadedSongFileName, setUploadedSongFileName] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const submitSong = async () => {
        const data = { name, thumbnail, track: trackUrl };
        try {
            const response = await makeAuthPOSTRequest("/song/create", data);
            if (response.err) {
                setErrorMessage("Could not upload song.");
                setSuccessMessage("");
                return;
            }
            setSuccessMessage("Song uploaded successfully!");
            setErrorMessage("");
            setTimeout(() => navigate("/home"), 2000);
        } catch (error) {
            setErrorMessage("Failed to upload song. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="h-full w-full p-4 sm:p-8 overflow-auto">
            <div className="mb-8 sm:mb-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Upload Your Song
                </h1>
                <p className="text-base sm:text-lg text-[#B0B0C0] mt-2">
                    Fill in the details to upload your song.
                </p>
            </div>

            <div className="max-w-full sm:max-w-lg mx-auto bg-[#2D2D5E] ml-0 p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <TextInput
                        label="Name"
                        placeholder="Enter song name"
                        value={name}
                        setValue={setName}
                    />
                </div>

                <div className="my-6">
                    <CloudinaryUpload
                        setUrl={setThumbnail}
                        setName={() => {}}
                        buttonLabel="Upload Thumbnail"
                    />
                    {thumbnail && (
                        <div className="mt-4 pl-1 bg-[#1A1A3B] border border-[#D0D0E0] rounded-lg p-4">
                            <img
                                src={thumbnail}
                                alt="Thumbnail Preview"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    )}
                </div>

                <div className="my-6">
                    {uploadedSongFileName ? (
                        <div className="bg-[#1A1A3B] border border-[#D0D0E0] text-[#FFFFFF] rounded-full p-4">
                            {uploadedSongFileName.substring(0, 20)}...
                        </div>
                    ) : (
                        <CloudinaryUpload
                            setUrl={setTrackUrl}
                            setName={setUploadedSongFileName}
                            buttonLabel="Upload Track"
                        />
                    )}
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
                        className="w-full p-3 border rounded-full bg-[#29B6F6] text-white font-semibold hover:bg-[#2D2D5E] hover:text-[#29B6F6] transition-colors duration-300"
                        onClick={submitSong}
                    >
                        Submit Song
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadSong;
