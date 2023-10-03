import { forwardRef, useState } from "react";

const InputComponent = forwardRef(
    ({ type = "text", placeholder = "Enter Details",maxLength=50,minLength=1 }, ref) => {

        const [filename,setFilename] = useState("");

        const handleFileChange = (e) => {
            const selectedFile = e.target.files[0];
            setFilename(selectedFile?.name)
        };

        return (
            <>
                {/* Input For Only File (For Label) */}
                <input
                    type="text"
                    placeholder={placeholder}
                    disabled
                    htmlFor={placeholder}
                    className={`bg-transparent outline-none focus:border-black focus:placeholder:text-black placeholder:text-[#BCBCBC] focus:text-black transition-all border-b-2 border-[#BCBCBC] my-[25px] py-1 text-lg px-1 w-full hidden ${
                        type === "file" && "!block"
                    }`}
                />

                {/* Input */}
                <input
                    type={type}
                    id={placeholder}
                    name={placeholder}
                    placeholder={placeholder}
                    ref={ref}
                    maxLength={maxLength}
                    minLength={minLength}
                    required={type !== 'file'}
                    className={`bg-transparent outline-none focus:border-black focus:placeholder:text-black placeholder:text-[#BCBCBC] focus:text-black transition-all border-b-2 border-[#BCBCBC] my-[25px] py-1 text-lg px-1 w-full ${
                        type === "file" && "hidden"
                    }`}
                    onChange={type === "file" ? handleFileChange : undefined}
                />

                {/* Label For File Upload */}
                {type === "file" ? (
                    <>
                        <label
                            htmlFor={placeholder}
                            className="w-full text-white py-2 max-w-[120px] bg-[#261E3B] rounded-lg text-center font-semibold cursor-pointer"
                        >
                            Choose
                        </label>
                        <span>{filename}</span>
                    </>
                ) : null}
            </>
        );
    }
);

export default InputComponent;
