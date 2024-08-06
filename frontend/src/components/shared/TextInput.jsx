const TextInput = ({
    label,
    placeholder,
    className = "",
    labelClassName = "",
    value,
    setValue,
}) => {
    return (
        <div
            className={`textInputDiv flex flex-col space-y-2 w-full ${className}`}
        >
            <label
                htmlFor={label}
                className={`text-white pl-1 font-semibold ${labelClassName}`}
            >
                {label}
            </label>

            <input
                type="text"
                placeholder={placeholder}
                className="p-3 border border-[#B0B0C0] border-solid bg-[#1A1A3B] text-white rounded placeholder-[#B0B0C0]"
                id={label}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
        </div>
    );
};

export default TextInput;
