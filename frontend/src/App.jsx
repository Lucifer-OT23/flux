import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import Login from "./routes/Login";
import SignUp from "./routes/SignUp";

import HomeIn from "./routes/HomeIn";
import UploadSong from "./routes/UploadSong";
import MySongs from "./routes/MySongs";
import Library from "./routes/Library";
import PlaylistView from "./routes/PlaylistView";
import songContext from "./contexts/songContext";

function App() {
    const [currentSong, setCurrentSong] = useState(null);
    const [soundPlayed, setSoundPlayed] = useState(null);
    const [isPaused, setIsPaused] = useState(true);

    const [cookie, setCookie] = useCookies(["token"]);

    return (
        <div className="w-full h-full font-poppins">
            <BrowserRouter>
                {cookie.token ? (
                    //logged In Routes
                    <songContext.Provider
                        value={{
                            currentSong,
                            setCurrentSong,
                            soundPlayed,
                            setSoundPlayed,
                            isPaused,
                            setIsPaused,
                        }}
                    >
                        <Routes>
                            <Route path="/home" element={<HomeIn />} />
                            <Route
                                path="/uploadsong"
                                element={<UploadSong />}
                            />
                            <Route path="/mysongs" element={<MySongs />} />
                            <Route path="/library" element={<Library />} />
                            <Route
                                path="/playlist/:playlistId"
                                element={<PlaylistView />}
                            />
                            <Route path="*" element={<Navigate to="/home" />} />
                        </Routes>
                    </songContext.Provider>
                ) : (
                    //logged Out Routes
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                )}
            </BrowserRouter>
        </div>
    );
}

export default App;
