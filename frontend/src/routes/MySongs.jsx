import React, { useEffect, useState } from "react";
import { makeAuthGETRequest } from "../utils/serverHelper";

import SongCard from "../components/shared/SongCard";
import LoggedIn from "../containers/LoggedIn";

const MySongs = () => {
    const [songData, setSongData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthGETRequest("/song/get/mysongs");
            console.log(response.data);
            if (Array.isArray(response.data)) {
                setSongData(response.data);
            } else if (response.data && Array.isArray(response.data.songs)) {
                setSongData(response.data.songs);
            }
        };
        getData();
    }, []);

    return (
        <LoggedIn currActiveScreen="mysongs">
            <div className="p-8">
                <div className="text-white text-2xl font-semibold pb-4">
                    My Songs
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {songData.map((item) => (
                        <SongCard
                            key={item._id}
                            info={item}
                            playSound={() => {}}
                        />
                    ))}
                </div>
            </div>
        </LoggedIn>
    );
};

export default MySongs;
