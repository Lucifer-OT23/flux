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
import LoggedIn from "./containers/LoggedIn";
import LikedSongs from "./routes/LikedSongs";

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
                            <Route
                                path="/"
                                element={<LoggedIn currActiveScreen="home" />}
                            >
                                <Route path="home" element={<HomeIn />} />
                                <Route
                                    path="uploadsong"
                                    element={
                                        <UploadSong currActiveScreen="uploadsong" />
                                    }
                                />
                                <Route
                                    path="mysongs"
                                    element={
                                        <MySongs currActiveScreen="mysongs" />
                                    }
                                />
                                <Route
                                    path="likedsongs"
                                    element={
                                        <LikedSongs currActiveScreen="likedsongs" />
                                    }
                                />
                                <Route
                                    path="library"
                                    element={
                                        <Library currActiveScreen="library" />
                                    }
                                />
                                <Route
                                    path="playlist/:playlistId"
                                    element={
                                        <PlaylistView currActiveScreen="playlist" />
                                    }
                                />
                                <Route
                                    path="*"
                                    element={<Navigate to="home" />}
                                />
                            </Route>
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
