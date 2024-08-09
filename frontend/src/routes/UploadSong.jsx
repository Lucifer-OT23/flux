import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeAuthPOSTRequest } from "../utils/serverHelper";
import TextInput from "../components/shared/TextInput";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";

const UploadSong = () => {
    const [name, setName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [trackUrl, setTrackUrl] = useState("");
    const [uploadedSongFileName, setUploadedSongFileName] = useState();
    const navigate = useNavigate();

    const submitSong = async () => {
        const data = { name, thumbnail, track: trackUrl };
        const response = await makeAuthPOSTRequest("/song/create", data);
        if (response.err) {
            alert("Could not upload song.");
            return;
        }
        alert("Success");
        navigate("/home");
    };

    return (
        <div className="p-8 max-w-2xl">
            <div className="text-2xl text-[#FFFFFF] font-bold mb-6">
                Upload Your Song
            </div>

            <div className="space-y-6">
                <TextInput
                    label="Name"
                    placeholder="Enter song name"
                    value={name}
                    setValue={setName}
                />

                <div className="flex flex-wrap gap-4">
                    <div className="w-full md:w-1/2">
                        <CloudinaryUpload
                            setUrl={setThumbnail}
                            setName={() => {}}
                            buttonLabel="Upload Thumbnail"
                        />
                        {thumbnail && (
                            <div className="mt-4 bg-[#1A1A3B] border border-[#D0D0E0] rounded-lg p-4">
                                <img
                                    src={thumbnail}
                                    alt="Thumbnail Preview"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-1/2">
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
                </div>
            </div>

            <div className="mt-10 flex justify-center">
                <button
                    className="bg-[#3C99DC] text-white border  font-semibold py-3 px-6 rounded-full hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                    onClick={submitSong}
                >
                    Submit Song
                </button>
            </div>
        </div>
    );
};

export default UploadSong;
