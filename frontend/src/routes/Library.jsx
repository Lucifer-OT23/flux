import React, { useEffect, useState } from "react";
import { makeAuthGETRequest } from "../utils/serverHelper";

import LoggedIn from "../containers/LoggedIn";
import { Navigate, useNavigate } from "react-router-dom";

const Library = () => {
    const [myPlaylists, setMyPlaylists] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthGETRequest("/playlist/get/me");
            setMyPlaylists(response.data);
            console.log(response);
        };
        getData();
    }, []);

    return (
        <LoggedIn currActiveScreen="library">
            <div className="text-white text-2xl font-semibold pt-8">
                My Playlists
            </div>

            <div className="py-5 grid  gap-4 grid-cols-4 ">
                {myPlaylists.map((item) => {
                    return (
                        <Card
                            key={item._id}
                            title={item.name}
                            description=""
                            imgUrl={item.thumbnail}
                            playlistId={item._id}
                        />
                    );
                })}
            </div>
        </LoggedIn>
    );
};

const Card = ({ title, description, imgUrl, playlistId }) => {
    const navigate = useNavigate();

    return (
        <div
            className="hover:bg-[#2D2D5E] hover:bg-opacity-30 w-full p-4 rounded-lg cursor-pointer transition duration-300 ease-in-out"
            onClick={() => {
                navigate(`/playlist/${playlistId}`);
            }}
        >
            <div className="pb-4 pt-2">
                <img
                    className="w-full rounded-md border border-[#1A1A3B] outline-10"
                    src={imgUrl}
                    alt="label img"
                />
            </div>
            <div className="text-white font-semibold py-2">{title}</div>
            <div className="text-[#B0B0C0] text-sm">{description}</div>
        </div>
    );
};

export default Library;
