import { createContext } from "react";

const songContext = createContext({
    currentSong: null,
    setCurrentSong: () => {},
    soundPlayed: null,
    setSoundPlayed: () => {},
    isPaused: true,
    setIsPaused: () => {},
});

export default songContext;
