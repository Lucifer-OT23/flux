import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { makeAuthGETRequest } from "../utils/serverHelper";

import SongCardSearch from "../components/shared/SongCardSearch";

const Search = ({ close }) => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [songData, setSongData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchSong = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await makeAuthGETRequest(
                `/song/get/songname/${searchText}`
            );
            if (Array.isArray(response.data)) {
                setSongData(response.data);
            } else if (response.data && Array.isArray(response.data.songs)) {
                setSongData(response.data.songs);
            }
        } catch (err) {
            setError("An error occurred while searching. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div
            className="absolute inset-0 bg-[#1A1A3B] bg-opacity-75 flex justify-center items-center z-50 overflow-auto"
            onClick={close}
        >
            <div
                className="w-full max-w-lg max-h-[90vh] py-6 px-4 bg-[#2D2D5E] bg-opacity-95 rounded-lg overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={`flex items-center text-white rounded-full p-3 space-x-3 ${
                        isInputFocused ? "border border-[#29B6F6]" : ""
                    } transition-all duration-300`}
                >
                    <Icon icon="octicon:search-16" className="text-lg" />
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        className="flex-grow bg-transparent focus:outline-none"
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchSong();
                            }
                        }}
                    />
                    {searchText && (
                        <button
                            onClick={() => setSearchText("")}
                            className="text-white focus:outline-none"
                        >
                            <Icon icon="mdi:close" className="text-lg" />
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="pt-10 pl-5 text-white">Loading...</div>
                ) : error ? (
                    <div className="pt-10 pl-5 text-red-500">{error}</div>
                ) : songData.length > 0 ? (
                    <div className="pt-10 pl-5 ">
                        <div className="text-white">
                            Showing search results for{" "}
                            <span className="font-bold">{searchText}</span>
                            ...
                        </div>
                        <div className="mt-3 space-y-4">
                            {songData.map((item) => (
                                <SongCardSearch
                                    key={item._id}
                                    info={item}
                                    playSound={() => {}}
                                    className="transition-opacity duration-500 ease-in-out"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-white">Try something new...</div>
                )}
            </div>
        </div>
    );
};

export default Search;
