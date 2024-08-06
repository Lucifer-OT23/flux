import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { makeAuthGETRequest } from "../utils/serverHelper";

import LoggedIn from "../containers/LoggedIn";
import SongCard from "../components/shared/SongCard";

const Search = () => {
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
        <LoggedIn currActiveScreen="search">
            <div className="w-full py-6">
                <div
                    className={`w-full sm:w-1/2 lg:w-1/3 p-3 flex text-sm rounded-full bg-[#2D2D5E] px-5 items-center text-white space-x-3 ${
                        isInputFocused ? "border border-[#29B6F6]" : ""
                    } transition-all duration-300`}
                >
                    <Icon icon="octicon:search-16" className="text-lg" />
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        className="w-full bg-[#2D2D5E] focus:outline-none"
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
                    <div className="pt-10 text-white pl-6">Loading...</div>
                ) : error ? (
                    <div className="pt-10 text-red-500">{error}</div>
                ) : songData.length > 0 ? (
                    <div className="pt-10 py-3 pl-6">
                        <div className="text-white">
                            Showing search results for{" "}
                            <span className="font-bold">{searchText}</span>...
                        </div>
                        <div className="mt-3 space-y-4">
                            {songData.map((item) => (
                                <SongCard
                                    key={item._id}
                                    info={item}
                                    playSound={() => {}}
                                    className="transition-opacity duration-500 ease-in-out"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="pt-10 pl-6 text-white">
                        Try something new...
                    </div>
                )}
            </div>
        </LoggedIn>
    );
};

export default Search;
