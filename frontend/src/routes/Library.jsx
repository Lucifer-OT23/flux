import React, { useEffect, useState } from "react";
import { makeAuthGETRequest } from "../utils/serverHelper";
import { useNavigate } from "react-router-dom";

const Library = () => {
    const [myPlaylists, setMyPlaylists] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthGETRequest("/playlist/get/me");
            setMyPlaylists(response.data);
        };
        getData();
    }, []);

    return (
        <div className="p-8">
            <div className="text-2xl sm:text-3xl font-bold text-white pb-2">
                Library
            </div>

            <div className="py-5 grid gap-6 grid-cols-1 hover: sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        </div>
    );
};

const Card = ({ title, description, imgUrl, playlistId }) => {
    const navigate = useNavigate();

    return (
        <div
            className="hover:bg-[#2D2D5E] hover:bg-opacity-30 w-full p-4 rounded-lg shadow-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => {
                navigate(`/playlist/${playlistId}`);
            }}
        >
            <div className="pb-4 pt-2">
                <img
                    className="w-full rounded-lg border border-[#1A1A3B] shadow-lg"
                    src={imgUrl}
                    alt="label img"
                />
            </div>
            <div className="text-white font-semibold text-lg py-2">{title}</div>
            <div className="text-[#B0B0C0] text-sm">{description}</div>
        </div>
    );
};

export default Library;
