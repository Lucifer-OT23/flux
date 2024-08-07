import React, { useState } from "react";
import { makeAuthPOSTRequest } from "../utils/serverHelper";

import TextInput from "../components/shared/TextInput";

const CreatePlaylist = ({ close }) => {
    const [playlistName, setPlaylistName] = useState("");
    const [playlistThumbnail, setPlaylistThumbnail] = useState("");

    const createPlaylist = async () => {
        const response = await makeAuthPOSTRequest(
            "playlist/create" +
                { name: playlistName, thumbnail: playlistThumbnail, songs: [] }
        );

        if (response._id) {
            close();
        }
    };

    return (
        <div
            className="absolute w-screen h-screen bg-[#1A1A3B] bg-opacity-50 flex justify-center items-center"
            onClick={close}
        >
            <div
                className="bg-[#2D2D5E] text-white w-1/3 rounded-md p-4 border border-white"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="mb-5 font-semibold text-lg">
                    Create Playlist
                </div>

                <div className="space-y-4 flex flex-col justify-center items-center">
                    <TextInput
                        label="Name"
                        labelClassName=""
                        placeholder="Playlist Name"
                        value={playlistName}
                        setValue={setPlaylistName}
                    />

                    <TextInput
                        label="Thumbnail"
                        labelClassName=""
                        placeholder="Thumbnail"
                        value={playlistThumbnail}
                        setValue={setPlaylistThumbnail}
                    />

                    <div
                        className="bg-[#3C99DC] font-semibold w-1/3 flex items-center justify-center py-4 rounded-full cursor-pointer"
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
