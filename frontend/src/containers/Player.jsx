import { useEffect, useState, useContext } from "react";
import { Howl } from "howler";
import { makeAuthGETRequest } from "../utils/serverHelper";
import { Icon } from "@iconify/react/dist/iconify.js";

import songContext from "../contexts/songContext";

const Player = () => {
    const [user, setUser] = useState("");
    const [songList, setSongList] = useState([]);
    const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
    const [addToPlaylist, setAddToPlaylist] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

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

    const changeSound = (songSrc) => {
        if (soundPlayed) {
            soundPlayed.stop();
            soundPlayed.unload();
        }

        setDuration(0); // Reset duration when changing song

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
        changeSound(nextSong.track);
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
        changeSound(prevSong.track);
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
        setIsShuffle(!isShuffle);
    };

    const handleRepeat = () => {
        setIsRepeat(!isRepeat);
    };

    return (
        <div className="player w-full h-[15%] bg-opacity-30 text-white flex items-center px-2 transition-all duration-300">
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
                        onClick={handleShuffle}
                    />
                    <Icon
                        icon="solar:skip-previous-outline"
                        fontSize={30}
                        className="hover:cursor-pointer hover:text-white text-[#B0B0C0]"
                        onClick={handlePrevious}
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
                        onClick={handleNext}
                    />
                    <Icon
                        icon="tabler:repeat"
                        fontSize={30}
                        className={`hover:cursor-pointer ${
                            isRepeat ? "text-white" : "text-[#B0B0C0]"
                        } `}
                        onClick={handleRepeat}
                    />
                </div>
                <div className="flex w-full justify-between items-center mt-2 text-sm">
                    <span>{formatTime(currentTime)}</span>

                    <div className="w-full mx-4 bg-[#B0B0C0] rounded-full h-1 relative">
                        <div
                            className="bg-[#29B6F6] h-1 rounded-full"
                            style={{
                                width: `${(currentTime / duration) * 100}%`,
                            }}
                        ></div>
                    </div>

                    <span>{formatTime(duration)}</span>
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
    );
};

export default Player;
