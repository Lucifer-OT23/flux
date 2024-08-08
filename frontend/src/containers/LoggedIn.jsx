import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeAuthGETRequest } from "../utils/serverHelper";

import flux from "../assets/flux-white.png";
import IconText from "../components/shared/IconText";
import songContext from "../contexts/songContext";
import CreatePlaylist from "../models/CreatePlaylist";
import AddToPlaylist from "../models/AddToPlaylist";
import Search from "../models/Search";
import Player from "./Player";

const LoggedIn = ({ children, currActiveScreen }) => {
    const [user, setUser] = useState("");
    const [songList, setSongList] = useState([]);
    const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
    const [addToPlaylist, setAddToPlaylist] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const { currentSong } = useContext(songContext);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await makeAuthGETRequest("/auth/me");
                if (response._id) {
                    setUser(response.firstName);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        getUser();

        const fetchSongs = async () => {
            try {
                const response = await makeAuthGETRequest("/song/get/recent");
                setSongList(response.data);
            } catch (error) {
                console.error("Failed to fetch songs:", error);
            }
        };

        fetchSongs();
    }, []);

    return (
        <div className="h-screen w-screen bg-[#1A1A3B]">
            {createPlaylistOpen && (
                <CreatePlaylist close={() => setCreatePlaylistOpen(false)} />
            )}

            {addToPlaylist && (
                <AddToPlaylist close={() => setAddToPlaylist(false)} />
            )}

            {searchOpen && <Search close={() => setSearchOpen(false)} />}

            <div
                className={`${currentSong ? "h-[85%]" : "h-full"} w-full flex`}
            >
                <div className="h-full w-1/5 bg-[#2D2D5E] flex flex-col justify-between pb-10 rounded-r-xl transition-all duration-300">
                    <div className="p-5 flex flex-col items-center">
                        <img src={flux} alt="logo" width="140" />
                    </div>

                    <div className="py-5">
                        <IconText
                            iconName="solar:home-angle-outline"
                            displayText="Home"
                            active={currActiveScreen === "home"}
                            targetLink="/home"
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                        />
                        <IconText
                            iconName="ic:outline-travel-explore"
                            displayText="Search"
                            active={currActiveScreen === "search"}
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                            onClick={() => setSearchOpen(true)}
                        />
                        <IconText
                            iconName="solar:music-library-2-outline"
                            displayText="Library"
                            active={currActiveScreen === "library"}
                            targetLink="/library"
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                        />
                        <IconText
                            iconName="solar:bag-music-2-linear"
                            displayText="My Songs"
                            targetLink="/mysongs"
                            active={currActiveScreen === "mysongs"}
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                        />
                    </div>

                    <div className="pt-5">
                        <IconText
                            iconName="tabler:playlist-add"
                            displayText="Create Playlist"
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                            onClick={() => setCreatePlaylistOpen(true)}
                        />
                        <IconText
                            iconName="tabler:music-heart"
                            displayText="Liked Songs"
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                        />
                    </div>
                </div>

                <div className="h-full w-4/5 bg-[#1A1A3B] overflow-auto">
                    <div className="navbar w-full h-1/10 bg-[#2D2D5E] bg-opacity-0 flex items-center justify-end transition-all duration-300">
                        <div className="w-3/4 h-full flex items-center justify-around">
                            <div className="w-full mx-2 h-full text-white flex items-center justify-end space-x-4">
                                <button className="h-2/3 px-4 flex items-center justify-center rounded-full font-semibold text-[#B0B0C0] hover:text-white transition-colors duration-300">
                                    <Link to="/support">Support</Link>
                                </button>

                                <button className="h-2/3 px-4 flex items-center justify-center rounded-full font-semibold text-[#B0B0C0] hover:bg-[#1A1A3B] hover:text-white transition-colors duration-300">
                                    <Link to="/uploadsong">Upload Song</Link>
                                </button>

                                <div className="h-1/2 rounded-full border border-white"></div>

                                <button className="bg-[#3C99DC] h-2/3 w-1/6 flex items-center justify-center rounded-full font-semibold border border-white cursor-default hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300">
                                    {user ? user : "User"}
                                </button>

                                <button className="bg-[#3C99DC] h-2/3 w-1/6 flex items-center justify-center rounded-full font-semibold border border-white hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="content p-7 pt-0 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>

            {currentSong && <Player />}
        </div>
    );
};

export default LoggedIn;
