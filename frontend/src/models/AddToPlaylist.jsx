import React, { useState, useEffect, useContext } from "react";
import { makeAuthGETRequest, makeAuthPOSTRequest } from "../utils/serverHelper";
import songContext from "../contexts/songContext";

const AddToPlaylist = ({ close }) => {
    const { currentSong } = useContext(songContext);
    const [myPlaylists, setMyPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await makeAuthGETRequest("/playlist/get/me");
                setMyPlaylists(response.data);
            } catch (err) {
                console.error("Failed to fetch playlists:", err);
            }
        };
        getData();
    }, []);

    const addSongToPlaylist = async (playlistId) => {
        setLoading(true);
        setError("");
        setSuccess("");

        const songId = currentSong._id;

        const payload = { playlistId, songId };
        try {
            const response = await makeAuthPOSTRequest(
                "/playlist/add/song",
                payload
            );
            if (response._id) {
                setSuccess("Song added to playlist successfully!");
                setTimeout(() => close(), 2000); // Close after 2 seconds
            }
        } catch (error) {
            setError("Failed to add song to playlist.");
            console.error("Failed to add song to playlist:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="absolute inset-0 bg-[#1A1A3B] bg-opacity-75 flex justify-center items-center z-50 overflow-auto"
            onClick={close}
        >
            <div
                className="w-full max-w-md max-h-[80vh] py-6 px-6 text-white bg-[#2D2D5E] bg-opacity-95 rounded-lg overflow-auto shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 font-semibold text-2xl text-center">
                    Select Playlist
                </div>

                {loading && (
                    <div className="text-center text-yellow-400">
                        Adding song...
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-500">{error}</div>
                )}
                {success && (
                    <div className="text-center text-green-500">{success}</div>
                )}

                <div className="space-y-4 flex flex-col justify-center items-center mt-4">
                    {myPlaylists.map((item) => (
                        <PlaylistComponent
                            key={item._id}
                            info={item}
                            addSongToPlaylist={addSongToPlaylist}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const PlaylistComponent = ({ info, addSongToPlaylist }) => {
    return (
        <div
            className="bg-[#2D2D5E] hover:bg-[#1A1A3B] flex items-center space-x-4 hover:bg-opacity-30 w-full p-4 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            onClick={() => {
                addSongToPlaylist(info._id);
            }}
        >
            <div className="w-20 h-20 flex-shrink-0">
                <img
                    className="w-full h-full rounded-lg border border-[#D0D0E0] shadow-inner"
                    src={info.thumbnail}
                    alt="thumbnail"
                />
            </div>
            <div className="text-white font-medium text-lg">{info.name}</div>
        </div>
    );
};

export default AddToPlaylist;
