import React, { useState } from "react";
import { makeAuthPOSTRequest } from "../utils/serverHelper";

import TextInput from "../components/shared/TextInput";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";

const CreatePlaylist = ({ close }) => {
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDesc, setPlaylistDesc] = useState("");
    const [playlistThumbnail, setPlaylistThumbnail] = useState("");

    const createPlaylist = async () => {
        const response = await makeAuthPOSTRequest("/playlist/create", {
            name: playlistName,
            thumbnail: playlistThumbnail,
            description: playlistDesc,
            songs: [],
        });

        if (response._id) {
            close();
        }
    };

    return (
        <div
            className="absolute inset-0 bg-[#1A1A3B] bg-opacity-75 flex justify-center items-center z-50 overflow-auto"
            onClick={close}
        >
            <div
                className="w-full max-w-lg max-h-[90vh] py-6 px-6 text-white bg-[#2D2D5E] bg-opacity-95 rounded-lg overflow-auto shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 font-semibold text-2xl text-center">
                    Create Playlist
                </div>

                <div className="space-y-6 flex flex-col justify-center items-center">
                    <TextInput
                        label="Playlist Name"
                        placeholder="Enter playlist name"
                        value={playlistName}
                        setValue={setPlaylistName}
                        inputClassName="w-full"
                    />

                    <TextInput
                        label="Description"
                        placeholder="enter something about your playlist"
                        value={playlistDesc}
                        setValue={setPlaylistDesc}
                        inputClassName="w-full"
                    />

                    <div className="w-full">
                        <CloudinaryUpload
                            setUrl={setPlaylistThumbnail}
                            setName={() => {}}
                            buttonLabel="Upload Thumbnail"
                        />
                        {playlistThumbnail && (
                            <div className="mt-4 bg-[#1A1A3B] border border-[#D0D0E0] rounded-lg p-4 shadow-inner">
                                <img
                                    src={playlistThumbnail}
                                    alt="Thumbnail Preview"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div
                        className="bg-[#3C99DC] font-semibold w-full sm:w-1/2 lg:w-1/3 flex items-center justify-center py-3 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        onClick={createPlaylist}
                    >
                        Create
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePlaylist;
