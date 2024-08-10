import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeAuthGETRequest } from "../utils/serverHelper";
import SongCard from "../components/shared/SongCard";

const PlaylistView = () => {
    const { playlistId } = useParams();
    const [playlistDetails, setPlaylistDetails] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await makeAuthGETRequest(
                    `/playlist/get/playlist/${playlistId}`
                );
                setPlaylistDetails(response);
            } catch (error) {
                console.error("Failed to fetch playlist details:", error);
            }
        };
        getData();
    }, [playlistId]);

    return (
        <div className="p-8 shadow-xl flex flex-col lg:flex-row">
            {playlistDetails._id && (
                <>
                    {/* Thumbnail Section */}
                    <div className="lg:w-1/3 lg:pr-8 mb-8 lg:mb-0">
                        <img
                            src={playlistDetails.thumbnail}
                            alt={`${playlistDetails.name} thumbnail`}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>

                    {/* Playlist Details and Songs Section */}
                    <div className="lg:w-2/3">
                        <div className="text-white text-3xl font-semibold mb-4">
                            {playlistDetails.name}
                        </div>

                        {/* Playlist Description */}
                        {playlistDetails.description && (
                            <div className="pl-2 text-md text-[#B0B0C0] mb-6">
                                {playlistDetails.description}
                            </div>
                        )}

                        {/* Songs Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
                            {playlistDetails.songs.map((item) => (
                                <SongCard
                                    key={item._id}
                                    info={item}
                                    playSound={() => {}}
                                    className="transition-opacity duration-500 ease-in-out"
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PlaylistView;
