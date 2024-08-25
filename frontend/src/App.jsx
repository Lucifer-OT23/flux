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
import Support from "./routes/Support";

function App() {
    const [currentSong, setCurrentSong] = useState(null);
    const [soundPlayed, setSoundPlayed] = useState(null);
    const [isPaused, setIsPaused] = useState(true);

    const [cookie] = useCookies(["token"]);

    return (
        <div className="w-full h-full font-poppins">
            <BrowserRouter>
                {cookie.token ? (
                    // Logged In Routes
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
                            <Route path="/" element={<Navigate to="home" />} />
                            <Route path="/" element={<LoggedIn />}>
                                <Route
                                    path="home"
                                    element={<HomeIn currActiveScreen="home" />}
                                />
                                <Route
                                    path="uploadsong"
                                    element={
                                        <UploadSong currActiveScreen="uploadsong" />
                                    }
                                />
                                <Route
                                    path="support"
                                    element={
                                        <Support currActiveScreen="support" />
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
                    // Logged Out Routes
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
