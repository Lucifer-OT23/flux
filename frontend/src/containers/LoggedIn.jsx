import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Howl, Howler } from "howler";
import { Link } from "react-router-dom";
import { makeAuthPOSTRequest } from "../utils/serverHelper";

import flux from "../assets/flux-white.png";
import IconText from "../components/shared/IconText";
import TextHover from "../components/shared/TextHover";
import songContext from "../contexts/songContext";
import CreatePlaylist from "../models/CreatePlaylist";
import AddToPlaylist from "../models/AddToPlaylist";
import Search from "../models/Search";

const LoggedIn = ({ children, currActiveScreen }) => {
    const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
    const [addToPlaylist, setAddToPlaylist] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const addSongToPlaylist = async (playlistId) => {
        const songId = currentSong._id;

        const payload = { playlistId, songId };

        const response = await makeAuthPOSTRequest(
            "/playlist/add/song",
            payload
        );

        if (response._id) {
            setCreatePlaylistOpen(false);
        }
        console.log(response);
    };

    const {
        currentSong,
        setCurrentSong,
        soundPlayed,
        setSoundPlayed,
        isPaused,
        setIsPaused,
    } = useContext(songContext);

    const playSound = () => {
        if (!soundPlayed) {
            return;
        }
        soundPlayed.play();
    };

    const changeSound = (songSrc) => {
        if (soundPlayed) {
            soundPlayed.stop();
        }

        let sound = new Howl({
            src: [songSrc],
            html5: true,
        });

        setSoundPlayed(sound);
        sound.play();
        setIsPaused(false);
    };

    const pauseSound = () => {
        soundPlayed.pause();
    };

    const togglePlayPause = () => {
        if (isPaused) {
            playSound();
            setIsPaused(false);
        } else {
            pauseSound();
            setIsPaused(true);
        }
    };

    const firstUpdate = useRef(true);

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        if (!currentSong) {
            return;
        }

        changeSound(currentSong.track);
    }, [currentSong && currentSong.track]);

    return (
        <div className="h-screen w-screen bg-[#1A1A3B]">
            {createPlaylistOpen && (
                <CreatePlaylist
                    close={() => {
                        setCreatePlaylistOpen(false);
                    }}
                />
            )}

            {addToPlaylist && (
                <AddToPlaylist
                    close={() => {
                        setAddToPlaylist(false);
                    }}
                    addSongToPlaylist={addSongToPlaylist}
                />
            )}

            {searchOpen && (
                <Search
                    close={() => {
                        setSearchOpen(false);
                    }}
                />
            )}

            <div className={`${currentSong ? "h-9/10" : "h-full"} w-full flex`}>
                <div className="h-full w-1/5 bg-[#2D2D5E] flex flex-col justify-between pb-10 rounded-r-xl transition-all duration-300">
                    <div>
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
                                onClick={() => {
                                    setSearchOpen(true);
                                }}
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
                                onClick={() => {
                                    setCreatePlaylistOpen(true);
                                }}
                            />

                            <IconText
                                iconName="tabler:music-heart"
                                displayText="Liked Songs"
                                className="hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300"
                            />
                        </div>
                    </div>

                    <div className="px-5">
                        <div className="border border-[#B0B0C0] text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center cursor-pointer hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300">
                            <Icon icon="uil:language" />
                            <p className="ml-2 text-sm font-semibold">
                                English
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-full w-4/5 bg-[#1A1A3B] overflow-auto">
                    <div className="navbar w-full h-1/10 bg-[#2D2D5E] bg-opacity-0 flex items-center justify-end transition-all duration-300">
                        <div className="w-1/2 h-full flex items-center">
                            <div className="w-3/5 px-2 flex justify-end items-center">
                                <TextHover displayText="Premium" />
                                <TextHover displayText="Support" />
                                <TextHover displayText="Download" />
                            </div>

                            <div className="h-1/2 border border-white rounded-full"></div>

                            <div className="w-2/5 ml-2 h-full text-white flex justify-around items-center">
                                <button className="bg-[#2D2D5E] bg-opacity-30 h-2/3 px-4 flex items-center justify-center rounded-full font-semibold border border-white hover:bg-[#1A1A3B] hover:text-[#29B6F6] transition-colors duration-300">
                                    <Link to="/uploadsong">Upload Song</Link>
                                </button>

                                <button className="bg-[#3C99DC] h-10 w-10 mr-2 flex items-center justify-center rounded-full font-semibold">
                                    <Link to="/login">JD</Link>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="content p-7 pt-0 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>

            {currentSong && (
                <div className="player w-full h-1/10 bg-opacity-30 text-white flex items-center px-2 transition-all duration-300">
                    <div className="w-1/4 flex items-center pl-2">
                        <img
                            src={currentSong.thumbnail}
                            alt="current song thumbnail"
                            className="w-14 h-14 rounded transition-all duration-300"
                        />

                        <div className="pl-4">
                            <div className="text-sm hover:underline hover:cursor-pointer">
                                {currentSong.name}
                            </div>
                            <div className="text-xs text-[#B0B0C0] hover:underline hover:cursor-pointer">
                                {currentSong.artist.firstName}{" "}
                                {currentSong.artist.lastName}
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 h-full flex flex-col justify-center items-center">
                        <div className="flex w-1/3 justify-between items-center">
                            <Icon
                                icon="tabler:arrows-shuffle"
                                fontSize={30}
                                className="hover:cursor-pointer hover:text-white text-[#B0B0C0]"
                                title="Shuffle"
                            />
                            <Icon
                                icon="solar:skip-previous-outline"
                                fontSize={30}
                                className="hover:cursor-pointer hover:text-white text-[#B0B0C0]"
                                title="Previous"
                            />
                            <Icon
                                icon={
                                    isPaused
                                        ? "solar:play-circle-outline"
                                        : "solar:pause-circle-outline"
                                }
                                fontSize={50}
                                className="hover:cursor-pointer hover:text-white text-[#B0B0C0]"
                                onClick={togglePlayPause}
                                title={isPaused ? "Play" : "Pause"}
                            />
                            <Icon
                                icon="solar:skip-next-outline"
                                fontSize={30}
                                className="hover:cursor-pointer hover:text-white text-[#B0B0C0]"
                                title="Next"
                            />
                            <Icon
                                icon="tabler:repeat"
                                fontSize={30}
                                className="hover:cursor-pointer hover:text-white text-[#B0B0C0]"
                                title="Repeat"
                            />
                        </div>
                    </div>

                    <div className="w-1/4 flex justify-end items-center pr-2 space-x-2">
                        <Icon
                            icon="tabler:music-plus"
                            fontSize={30}
                            className="hover:cursor-pointer hover:text-white text-[#B0B0C0]"
                            onClick={() => {
                                setAddToPlaylist(true);
                            }}
                        />

                        <Icon
                            icon="solar:heart-outline"
                            fontSize={30}
                            className="hover:cursor-pointer hover:text-white text-[#B0B0C0]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoggedIn;
