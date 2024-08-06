import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeAuthPOSTRequest } from "../utils/serverHelper";

import TextInput from "../components/shared/TextInput";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";
import LoggedIn from "../containers/LoggedIn";

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
        <LoggedIn>
            <div className="text-2xl text-white mt-8 font-semibold mb-5">
                Upload Your Song
            </div>

            <div className="w-2/3 flex space-x-3">
                <div className="1/3">
                    <TextInput
                        label="Name"
                        placeholder="Name"
                        value={name}
                        setValue={setName}
                    />
                </div>

                <div className="1/3">
                    <TextInput
                        label="Thumbnail"
                        placeholder="Thumbnail"
                        value={thumbnail}
                        setValue={setThumbnail}
                    />
                </div>
            </div>

            <div className="w-2/3 flex items-center justify-between">
                <div className="py-5 w-[33%]">
                    {uploadedSongFileName ? (
                        <div className="bg-[#1A1A3B] border border-white text-white rounded-full p-3 w-full">
                            {uploadedSongFileName.substring(0, 20)}...
                        </div>
                    ) : (
                        <CloudinaryUpload
                            setUrl={setTrackUrl}
                            setName={setUploadedSongFileName}
                        />
                    )}
                </div>

                <div
                    className="bg-[#3C99DC] text-white font-semibold w-40 flex items-center justify-center p-4 px-2 rounded-full cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault;
                        submitSong();
                    }}
                >
                    Submit Song
                </div>
            </div>
        </LoggedIn>
    );
};

export default UploadSong;
