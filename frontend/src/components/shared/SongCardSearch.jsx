import React, { useContext, useState } from "react";
import songContext from "../../contexts/songContext";

const SongCardSearch = ({ info, playSound }) => {
    const { currentSong, setCurrentSong } = useContext(songContext);

    return (
        <div
            className="text-white flex items-center hover:bg-[#1A1A3B] hover:bg-opacity-30 p-2 rounded-lg cursor-pointer transition duration-300 ease-in-out"
            onClick={() => {
                setCurrentSong(info);
                playSound();
            }}
        >
            {/* Thumbnail Container */}
            <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-md bg-[#333]">
                <img
                    src={info.thumbnail}
                    alt={info.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Song Info */}
            <div className="flex flex-col justify-center ml-3 w-full">
                <div className="text-sm font-semibold truncate hover:underline">
                    {info.name}
                </div>
                <div className="text-xs text-[#B0B0C0] truncate hover:underline">
                    {info.artist.firstName} {info.artist.lastName}
                </div>
            </div>
        </div>
    );
};

export default SongCardSearch;
