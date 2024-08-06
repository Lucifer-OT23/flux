import React, { useEffect, useState } from "react";
import { makeAuthGETRequest } from "../utils/serverHelper";

import LoggedIn from "../containers/LoggedIn";
import SongCard from "../components/shared/SongCard";

const Home = () => {
    const [featuredSongs, setFeaturedSongs] = useState([]);
    const [recentSongs, setRecentSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const featuredResponse = await makeAuthGETRequest(
                    "/song/get/featured"
                );
                const recentResponse = await makeAuthGETRequest(
                    "/song/get/recent"
                );

                setFeaturedSongs(featuredResponse.data || []);
                setRecentSongs(recentResponse.data || []);
            } catch (error) {
                console.error("Failed to fetch songs:", error);
            }
        };

        fetchSongs();
    }, []);

    return (
        <LoggedIn currActiveScreen="home">
            <div className="h-full w-full p-7 overflow-auto">
                {/* Welcome Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back!
                    </h1>
                    <p className="text-lg text-[#B0B0C0] mt-2">
                        Explore your favorite tunes and discover new music.
                    </p>
                </div>

                {/* Featured Songs */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        Featured Songs
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {featuredSongs.length > 0 ? (
                            featuredSongs.map((song) => (
                                <SongCard
                                    key={song._id}
                                    info={song}
                                    playSound={() => {}}
                                />
                            ))
                        ) : (
                            <div className="text-white text-center col-span-full">
                                No featured songs available.
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Songs */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        Recent Songs
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recentSongs.length > 0 ? (
                            recentSongs.map((song) => (
                                <SongCard
                                    key={song._id}
                                    info={song}
                                    playSound={() => {}}
                                />
                            ))
                        ) : (
                            <div className="text-white text-center col-span-full">
                                No recent songs available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LoggedIn>
    );
};

export default Home;
