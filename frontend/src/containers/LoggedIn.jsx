import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { makeAuthGETRequest, makeAuthPOSTRequest } from "../utils/serverHelper";

import flux from "../assets/flux-white.png";
import IconText from "../components/shared/IconText";
import songContext from "../contexts/songContext";
import CreatePlaylist from "../models/CreatePlaylist";
import AddToPlaylist from "../models/AddToPlaylist";
import Search from "../models/Search";
import Player from "./Player";

const LoggedIn = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState("");
    const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
    const [addToPlaylist, setAddToPlaylist] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const { currentSong } = useContext(songContext);
    const currActiveScreen = location.pathname.split("/")[1] || "home";
    console.log(currActiveScreen);

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
    }, []);

    const handleLogout = async () => {
        try {
            await makeAuthPOSTRequest("/auth/logout");
            document.cookie =
                "token" + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            localStorage.clear();
            navigate("/login");
            window.location.reload();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

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
                <div className="h-full w-1/5 bg-[#2D2D5E] flex flex-col justify-start pb-10 rounded-tr-xl space-y-2 transition-all duration-300">
                    <div className="p-5 flex flex-col items-center justify-center">
                        <img src={flux} alt="logo" width="140" />
                    </div>

                    <div className="py-5 space-y-2">
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
                            iconName="tabler:music-heart"
                            displayText="Liked Songs"
                            targetLink="/likedsongs"
                            active={currActiveScreen === "likedsongs"}
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                        />
                        <IconText
                            iconName="solar:bag-music-2-linear"
                            displayText="My Songs"
                            targetLink="/mysongs"
                            active={currActiveScreen === "mysongs"}
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                        />
                        <IconText
                            iconName="solar:music-library-2-outline"
                            displayText="Library"
                            active={currActiveScreen === "library"}
                            targetLink="/library"
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                        />
                        <IconText
                            iconName="tabler:playlist-add"
                            displayText="Create Playlist"
                            className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                            onClick={() => setCreatePlaylistOpen(true)}
                        />
                    </div>
                </div>

                <div className="h-full w-4/5 bg-[#1A1A3B] overflow-auto">
                    <div className="navbar w-full h-16 bg-[#2D2D5E] bg-opacity-0 flex items-center justify-end transition-all duration-300">
                        <div className="w-3/4 m-4 h-full flex items-center">
                            <div className="w-full h-full text-white flex items-center justify-end space-x-5">
                                <button
                                    className={`h-10 px-4 flex items-center rounded-full font-semibold ${
                                        currActiveScreen === "support"
                                            ? "text-white"
                                            : "text-[#B0B0C0] hover:text-white"
                                    } transition-colors duration-300`}
                                >
                                    <Link to="/support">Support</Link>
                                </button>

                                <button
                                    className={`h-10 px-4 flex items-center rounded-full font-semibold ${
                                        currActiveScreen === "uploadsong"
                                            ? "text-white"
                                            : "text-[#B0B0C0] hover:text-white"
                                    } transition-colors duration-300`}
                                >
                                    <Link to="/uploadsong">Upload Song</Link>
                                </button>

                                <div className="h-10 rounded-full border border-white"></div>

                                <button className="bg-[#3C99DC] h-2/3 w-1/6 flex items-center justify-center rounded-full font-semibold border border-white cursor-default hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300">
                                    {user ? user : "User"}
                                </button>

                                <button
                                    className="bg-[#3C99DC] h-10 w-1/6 flex items-center justify-center rounded-full font-semibold border border-white hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="content p-8 pt-0 overflow-auto">
                        <Outlet />
                    </div>
                </div>
            </div>

            {currentSong && (
                <Player
                    setAddToPlaylist={setAddToPlaylist}
                    setCreatePlaylistOpen={setCreatePlaylistOpen}
                />
            )}
        </div>
    );
};

export default LoggedIn;
