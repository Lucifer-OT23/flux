const TextHover = ({ displayText, active, className }) => {
    return (
        <div className="flex items-center justify-center px-2">
            <div
                className={`${
                    active ? "text-white" : "text-[#B0B0C0]"
                } text-lg font-semibold cursor-pointer hover:text-white`}
            >
                {displayText}
            </div>
        </div>
    );
};

export default TextHover;
