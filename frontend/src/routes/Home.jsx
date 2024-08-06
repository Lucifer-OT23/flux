import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import flux from "../assets/flux-white.png";
import IconText from "../components/shared/IconText";

import TextHover from "../components/shared/TextHover";

const focusCardData = [
    {
        title: "Cyberpunk 2077",
        description: "cyberpunk 2077's original soudntracks",
        imgUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84db959c3b418a4505e74744f8",
    },
    {
        title: "Baldurs Gate 3",
        description: "baldurs' gate 3 original soundtracks",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2736842c99f481b8560a7db0b35",
    },
    {
        title: "God of War",
        description: "god of war's original soundtracks",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2739f1c86cf986dec4c07ace79a",
    },
    {
        title: "Attack On Titan",
        description: "attack on titan's original soundtracks",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b273d8cfa1c163334abf3e5817e9",
    },
    {
        title: "Oppenheimer",
        description: "oppheimer's original soundtracks",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b273af634982d9b15de3c77f7dd9",
    },
];

const Home = () => {
    return (
        <div className="h-screen w-screen bg-[#1A1A3B] flex">
            <div className="h-full w-1/5 bg-[#2D2D5E] flex flex-col justify-between pb-10 rounded-r-xl">
                <div>
                    <div className="p-5 flex flex-col items-center">
                        <img src={flux} alt="logo" width="140" />
                    </div>

                    <div className="py-5">
                        <IconText
                            iconName="octicon:home-fill-24"
                            displayText="Home"
                            active
                        />
                        <IconText
                            iconName="octicon:search-16"
                            displayText="Search"
                        />
                        <IconText
                            iconName="solar:music-library-bold-duotone"
                            displayText="Library"
                        />
                    </div>

                    <div className="pt-5">
                        <IconText
                            iconName="tabler:playlist-add"
                            displayText="Create Playlist"
                        />

                        <IconText
                            iconName="tabler:music-heart"
                            displayText="Liked Songs"
                        />
                    </div>
                </div>

                <div className="px-5">
                    <div className="border border-[#B0B0C0] text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center cursor-pointer">
                        <Icon icon="uil:language" />
                        <p className="ml-2 text-sm font-semibold">English</p>
                    </div>
                </div>
            </div>

            <div className="h-full w-4/5 bg-[#1A1A3B] overflow-auto">
                <div className="navbar w-full h-1/10 bg-[#2D2D5E] bg-opacity-0 flex items-center justify-end">
                    <div className="w-1/2 h-full flex items-center">
                        <div className="w-3/5 px-2 flex justify-end items-center">
                            <TextHover displayText="Premium" />
                            <TextHover displayText="Suppport" />
                            <TextHover displayText="Download" />
                        </div>

                        <div className="h-1/2 border border-white rounded-full"></div>

                        <div className="w-2/5 ml-2 h-full text-white flex justify-around items-center">
                            <button className="bg-[#2D2D5E] bg-opacity-30 h-2/3 px-4 flex items-center justify-center rounded-full font-semibold border border-white">
                                <Link to="/signup">Sign Up</Link>
                            </button>

                            <button className="bg-[#3C99DC] h-2/3 px-6 flex items-center justify-center rounded-full font-semibold">
                                <Link to="/login">Log In</Link>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="content p-7 pt-0 overflow-auto">
                    <PlaylistView titleText="Focus" cardData={focusCardData} />
                    <PlaylistView
                        titleText="Recommended"
                        cardData={focusCardData}
                    />
                    <PlaylistView
                        titleText="Something New"
                        cardData={focusCardData}
                    />
                </div>
            </div>
        </div>
    );
};

const PlaylistView = ({ titleText, cardData }) => {
    return (
        <div className="text-white mt-8">
            <div className="text-2xl font-semibold mb-5">{titleText}</div>

            <div className="w-full flex justify-aroundd space-x-3">
                {cardData.map((item) => {
                    return (
                        <Card
                            title={item.title}
                            description={item.description}
                            imgUrl={item.imgUrl}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const Card = ({ title, description, imgUrl }) => {
    return (
        <div className="bg-[#2D2D5E] bg-opacity-60 w-1/3 p-4 rounded-lg">
            <div className="pb-2 pt-2">
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

export default Home;
