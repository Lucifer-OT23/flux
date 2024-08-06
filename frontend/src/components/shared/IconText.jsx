import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const IconText = ({ iconName, displayText, active, targetLink }) => {
    return (
        <Link to={targetLink} className="block">
            <div className="flex items-center justify-start">
                <div className="px-5 py-2 cursor-pointer">
                    <Icon
                        icon={iconName}
                        color={active ? "white" : "#B0B0C0"}
                        fontSize={28}
                    />
                </div>
                <div
                    className={`${
                        active ? "text-white" : "text-[#B0B0C0]"
                    } text-sm font-semibold cursor-pointer hover:text-white`}
                >
                    {displayText}
                </div>
            </div>
        </Link>
    );
};

export default IconText;
