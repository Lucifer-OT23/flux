import React, { useEffect, useState } from "react";
import { makeAuthGETRequest } from "../utils/serverHelper";
import SongCard from "../components/shared/SongCard";

const LikedSongs = () => {
    const [songData, setSongData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await makeAuthGETRequest("/song/liked");
                if (Array.isArray(response.data)) {
                    setSongData(response.data);
                } else {
                    console.error("Unexpected response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching liked songs:", error);
            }
        };

        getData();
    }, []);

    return (
        <div className="p-8">
            <div className="text-white text-2xl font-semibold pb-4">
                Liked Songs
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {songData.map((item) => (
                    <SongCard key={item._id} info={item} playSound={() => {}} />
                ))}
            </div>
        </div>
    );
};

export default LikedSongs;
