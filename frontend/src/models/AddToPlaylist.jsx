import React, { useState, useEffect } from "react";

import { makeAuthGETRequest } from "../utils/serverHelper";

const AddToPlaylist = ({ close, addSongToPlaylist }) => {
    const [myPlaylists, setMyPlaylists] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthGETRequest("/playlist/get/me");
            setMyPlaylists(response.data);
            console.log(response);
        };
        getData();
    }, []);

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
                <div className="mb-5 font-semibold text-xl">
                    Select Playlist
                </div>

                <div className="space-y-4 flex flex-col justify-center items-center">
                    {myPlaylists.map((item) => {
                        return (
                            <PlaylistComponent
                                info={item}
                                addSongToPlaylist={addSongToPlaylist}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const PlaylistComponent = ({ info, addSongToPlaylist }) => {
    return (
        <div
            className="bg-[#2D2D5E] hover:bg-[#1A1A3B] flex items-center space-x-4 hover:bg-opacity-30 w-full p-4 rounded-lg cursor-pointer transition duration-300 ease-in-out"
            onClick={() => {
                addSongToPlaylist(info._id);
            }}
        >
            <div className="pb-2 pt-2">
                <img
                    className="w-20 h-20 rounded"
                    src={info.thumbnail}
                    alt="thumbnail"
                />
            </div>
            <div className="text-white font-medium text-lg">{info.name}</div>
        </div>
    );
};

export default AddToPlaylist;
