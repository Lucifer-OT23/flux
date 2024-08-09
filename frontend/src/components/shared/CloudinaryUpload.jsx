import {
    cloudinary_upload_preset,
    cloudinary_cloud_name,
} from "../../utils/config";
import { openUploadWidget } from "../../utils/cloudinaryService";

const CloudinaryUpload = ({ setUrl, setName, buttonLabel }) => {
    const uploadWidget = () => {
        const myUploadWidget = openUploadWidget(
            {
                cloudName: cloudinary_cloud_name,
                uploadPreset: cloudinary_upload_preset,
                sources: ["local"],
            },
            function (error, result) {
                if (!error && result && result.event === "success") {
                    setUrl(result.info.secure_url);
                    setName(result.info.original_filename);
                } else {
                    if (error) {
                        console.error("Upload failed: ", error);
                        alert("Upload failed. Please try again.");
                    }
                }
            }
        );
        myUploadWidget.open();
    };

    return (
        <button
            className="bg-[#1A1A3B] max-w-[70%] border border-[#D0D0E0] text-[#FFFFFF] font-semibold py-2 px-6 rounded-xl hover:bg-[#00B8F6] transition-colors w-full"
            onClick={uploadWidget}
        >
            {buttonLabel || "Upload File"}
        </button>
    );
};

export default CloudinaryUpload;
