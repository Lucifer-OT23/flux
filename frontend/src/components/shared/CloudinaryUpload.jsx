import { cloudinary_upload_preset } from "../../utils/config";
import { cloudinary_cloud_name } from "../../utils/config";
import { openUploadWidget } from "../../utils/cloudinaryService";

const CloudinaryUploadWidget = ({ setUrl, setName }) => {
    const uploadWidget = () => {
        let myUploadWidget = openUploadWidget(
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
                        console.log(error);
                    }
                }
            }
        );
        myUploadWidget.open();
    };

    return (
        <button
            className="bg-[#1A1A3B] border border-white text-white font-semibold rounded-full p-4"
            onClick={uploadWidget}
        >
            Select Track
        </button>
    );
};

export default CloudinaryUploadWidget;
