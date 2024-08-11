import { useEffect, useState, useContext } from "react";
import { Howl } from "howler";
import {
    makeAuthDELETERequest,
    makeAuthGETRequest,
    makeAuthPOSTRequest,
} from "../utils/serverHelper";
import { Icon } from "@iconify/react/dist/iconify.js";

import songContext from "../contexts/songContext";

const Player = ({ setAddToPlaylist }) => {
    const [user, setUser] = useState("");
    const [songList, setSongList] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const {
        currentSong,
        setCurrentSong,
        soundPlayed,
        setSoundPlayed,
        isPaused,
        setIsPaused,
    } = useContext(songContext);

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

    useEffect(() => {
        const checkIfLiked = async () => {
            if (currentSong) {
                try {
                    const response = await makeAuthGETRequest(
                        `/song/liked/${currentSong._id}`
                    );
                    setIsLiked(response.liked);
                } catch (error) {
                    console.error("Failed to check if song is liked:", error);
                }
            }
        };

        checkIfLiked();
    }, [currentSong]);

    const changeSound = (songSrc) => {
        if (soundPlayed) {
            soundPlayed.stop();
            soundPlayed.unload();
        }

        setDuration(0);

        const sound = new Howl({
            src: [songSrc],
            html5: true,
            onload: () => {
                console.log("Duration on load:", sound.duration());
                setDuration(sound.duration());
            },
            onplay: () => {
                requestAnimationFrame(updateProgress);
            },
            onend: () => {
                if (isRepeat) {
                    sound.play();
                } else {
                    handleNext();
                }
            },
        });

        setSoundPlayed(sound);
        sound.play();
        setIsPaused(false);
    };

    const updateProgress = () => {
        if (soundPlayed && !isPaused && soundPlayed.playing()) {
            setCurrentTime(soundPlayed.seek());
            requestAnimationFrame(updateProgress);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && soundPlayed && soundPlayed.playing()) {
                setCurrentTime(soundPlayed.seek());
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [soundPlayed, isPaused]);

    useEffect(() => {
        if (currentSong) {
            changeSound(currentSong.track);
        }
    }, [currentSong]);

    const handleNext = () => {
        if (!Array.isArray(songList) || songList.length === 0) {
            console.error("Song list is empty or not an array");
            return;
        }

        const currentIndex = songList.findIndex(
            (song) => song._id === currentSong._id
        );
        if (currentIndex === -1) return;

        const nextIndex = isShuffle
            ? Math.floor(Math.random() * songList.length)
            : (currentIndex + 1) % songList.length;

        const nextSong = songList[nextIndex];
        setCurrentSong(nextSong);
    };

    const handlePrevious = () => {
        if (!Array.isArray(songList) || songList.length === 0) {
            console.error("Song list is empty or not an array");
            return;
        }

        const currentIndex = songList.findIndex(
            (song) => song._id === currentSong._id
        );
        if (currentIndex === -1) return;

        const prevIndex = isShuffle
            ? Math.floor(Math.random() * songList.length)
            : (currentIndex - 1 + songList.length) % songList.length;

        const prevSong = songList[prevIndex];
        setCurrentSong(prevSong);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${
            remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
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

    const playSound = () => {
        if (soundPlayed && !soundPlayed.playing()) {
            soundPlayed.play();
        }
    };

    const pauseSound = () => {
        if (soundPlayed && soundPlayed.playing()) {
            soundPlayed.pause();
        }
    };

    const handleShuffle = () => {
        setIsShuffle((prevShuffle) => !prevShuffle);
    };

    const handleRepeat = () => {
        setIsRepeat((prevRepeat) => !prevRepeat);
    };

    const handleLike = async () => {
        try {
            const endpoint = `/song/${isLiked ? "unlike" : "like"}/${
                currentSong._id
            }`;
            const response = isLiked
                ? await makeAuthDELETERequest(endpoint)
                : await makeAuthPOSTRequest(endpoint);

            if (response.message) {
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error("Failed to like/unlike song:", error);
        }
    };

    return (
        <div className="player w-full h-[15%] bg-gradient-to-r from-[#0C0C26] to-[#1A1A3B] shadow-lg p-4 text-white flex items-center px-2 transition-all duration-300">
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

            <div className="w-2/4 flex flex-col items-center justify-center">
                <div className="flex items-center">
                    <button
                        onClick={handlePrevious}
                        className="p-2 transition-all duration-300"
                    >
                        <Icon
                            icon="tabler:player-track-prev"
                            width="24"
                            height="24"
                        />
                    </button>
                    <button
                        onClick={togglePlayPause}
                        className="p-2 mx-2 transition-all duration-300"
                    >
                        <Icon
                            icon={`${
                                isPaused
                                    ? "tabler:player-play"
                                    : "tabler:player-pause"
                            }`}
                            width="30"
                            height="30"
                        />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-2 transition-all duration-300"
                    >
                        <Icon
                            icon="tabler:player-track-next"
                            width="24"
                            height="24"
                        />
                    </button>
                </div>
                <div className="w-full flex items-center px-2 mt-2">
                    <div className="text-xs text-[#B0B0C0] w-1/5 text-right font-medium">
                        {formatTime(currentTime)}
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        step="1"
                        value={currentTime}
                        onChange={(e) => {
                            if (soundPlayed) {
                                soundPlayed.seek(e.target.value);
                                setCurrentTime(e.target.value);
                            }
                        }}
                        className="w-3/5 mx-2 thin-range-input h-1 bg-gradient-to-r from-[#00B8F6] to-[#34C8FF] rounded-full"
                    />
                    <div className="text-xs text-[#B0B0C0] w-1/5 font-medium">
                        {formatTime(duration)}
                    </div>
                </div>
            </div>

            <div className="w-1/4 flex justify-end items-center">
                <button
                    onClick={() => setAddToPlaylist(true)}
                    className="p-2 mx-1 transition-all duration-300"
                >
                    <Icon
                        icon="ic:baseline-playlist-add"
                        width="24"
                        height="24"
                    />
                </button>
                <button
                    onClick={handleLike}
                    className="p-2 mx-1 transition-all duration-300"
                >
                    <Icon
                        icon={`${
                            isLiked
                                ? "mdi:cards-heart"
                                : "mdi:cards-heart-outline"
                        }`}
                        width="24"
                        height="24"
                    />
                </button>
                <button
                    onClick={handleShuffle}
                    className={`p-2 mx-1 ${
                        isShuffle ? "text-[#00B8F6]" : ""
                    } transition-all duration-300`}
                >
                    <Icon icon="mdi:shuffle" width="24" height="24" />
                </button>
                <button
                    onClick={handleRepeat}
                    className={`p-2 mx-1 ${
                        isRepeat ? "text-[#00B8F6]" : ""
                    } transition-all duration-300`}
                >
                    <Icon
                        icon="material-symbols:repeat-rounded"
                        width="24"
                        height="24"
                    />
                </button>
            </div>
        </div>
    );
};

export default Player;
