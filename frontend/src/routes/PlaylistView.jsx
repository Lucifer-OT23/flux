import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeAuthGETRequest } from "../utils/serverHelper";

import LoggedIn from "../containers/LoggedIn";
import SongCard from "../components/shared/SongCard";

const PlaylistView = () => {
    const { playlistId } = useParams();
    const [playlistDetails, setPlaylistDetails] = useState({});

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthGETRequest(
                "/playlist/get/playlist/" + playlistId
            );
            setPlaylistDetails(response);
            console.log(response);
        };
        getData();
    }, [playlistId]);

    return (
        <LoggedIn>
            {playlistDetails._id && (
                <div className="p-8">
                    <div className="text-white text-2xl font-semibold pb-4">
                        {playlistDetails.name}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
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
                </div>
            )}
        </LoggedIn>
    );
};

export default PlaylistView;
