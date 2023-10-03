import React, { useState } from "react";
import { useRef } from "react";
import AuthHeader from "../../components/AuthHeader";
import InputComponent from "../../components/InputComponent";
import Webcam from "webcam-easy";
import { useEffect } from "react";
import backend from "../../entities/axios";
import {
    getDownloadURL,
    ref,
    uploadBytes,
    uploadString,
} from "firebase/storage";
import { storage } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const hospitalName = useRef();
    const email = useRef();
    const password = useRef();
    const accessCode = useRef();
    const webcamElement = useRef();
    const canvasElement = useRef();
    const [isNextStep, setIsNextStep] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState();
    // const {changeUser,user} = useAuth();
    let [webcam, setWebCam] = useState();
    let [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { changeUser } = useAuth();

    const onSubmit = (e) => {
        e.preventDefault();
        setIsNextStep(true);
    };

    useEffect(() => {
        webcam = new Webcam(
            webcamElement.current,
            "user",
            canvasElement.current
        );
        webcam
            .start()
            .then((result) => {
                console.log("webcam started");
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isNextStep, capturedPhoto]);

    const capture = () => {
        let picture = webcam.snap();
        setCapturedPhoto(picture);
    };

    const retake = () => {
        setCapturedPhoto(null);
        console.log(webcamElement);
        // setWebCam(new Webcam(webcamElement.current, "user",canvasElement.current));

        webcam
            .start()
            .then((result) => {
                console.log("webcam started");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const finishForm = async () => {
        setIsLoading(true);
        const emailValue = email.current.value;
        const passwordValue = password.current.value;
        const code = accessCode.current.value;

        try {
            const storageRef = ref(storage);

            const certificateFileRef = ref(
                storageRef,
                `certificates/${Math.random(1).toString(36).slice(2)}`
            );

            // Upload the file to Firebase Storage
            await uploadString(
                certificateFileRef,
                capturedPhoto,
                "data_url"
            ).then((snapshot) => {
                console.log("Uploaded a data_url string!");
            });
            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(certificateFileRef);
            const response = await backend.post("auth/login", {
                email: emailValue,
                password: passwordValue,
                imageUrl: downloadURL,
                accessCode: code,
            });

            if (response.status === 200) {
                console.log(response);
                changeUser(response.data);
                navigate("/");
            } else {
                console.log(response);
                toast.error("Error Logging you in", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            }
        } catch (error) {
            let message = ""
            if (error?.response?.data?.message) {
                message = error?.response?.data?.message;
            } else {
                message = "Error Login";
            }
            toast.error(message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full min-h-screen pt-20 px-20">
            <AuthHeader />
            <div className="w-full h-full my-10 flex items-center justify-center flex-row overflow-x-scroll gap-y-10">
                <div>
                    <form
                        onSubmit={onSubmit}
                        className={`items-center justify-center flex-col gap-y-6 ${
                            !isNextStep ? "flex" : "hidden"
                        }`}
                    >
                        <div className=" box w-[514px] h-[540px] flex flex-col items-center justify-center p-8">
                            <h1 className="text-[#261E3B] text-3xl font-semibold mb-3">
                                Welcome to Sicu-aura
                            </h1>
                            <p className="text-[#BCBCBC] text-center text-sm">
                                Your one stop safety solutions using innovative
                                technology
                            </p>
                            <div className="flex-col flex item-center w-full max-w-[340px] mt-10">
                                <InputComponent
                                    placeholder={"Hospital Name"}
                                    ref={hospitalName}
                                />
                                <InputComponent
                                    placeholder={"Email ID"}
                                    ref={email}
                                />
                                <InputComponent
                                    placeholder={"Password"}
                                    ref={password}
                                />
                                <InputComponent
                                    placeholder={"Special Access Code"}
                                    ref={accessCode}
                                />
                            </div>
                        </div>
                        <button className="btn">Login</button>
                    </form>
                </div>
                <div
                    className={`items-center justify-center flex-col ${
                        isNextStep ? "flex" : "hidden"
                    }`}
                >
                    <div className="w-[514px] h-[540px] flex flex-col items-start justify-center p-8">
                        <h2 className="text-2xl text-[#505050] font-semibold">
                            Please Capture our face to continue
                        </h2>
                        {capturedPhoto ? (
                            <img
                                src={capturedPhoto}
                                className={
                                    "bg-[#C0C0C0] rounded-xl border border-solid border-[#909090] mt-8 flex items-center justify-center"
                                }
                            />
                        ) : null}
                        <span>
                            if web cam is not working try allowing permission to
                            web cam or using another browser
                        </span>
                        <video
                            id="webcam"
                            autoplay
                            playsinline
                            width="640"
                            height="480"
                            ref={webcamElement}
                            className={`bg-[#C0C0C0] rounded-xl border border-solid border-[#909090] mt-8 flex items-center justify-center ${
                                capturedPhoto && "hidden"
                            }`}
                        ></video>
                        <canvas
                            ref={canvasElement}
                            className="hidden"
                            width="640"
                            height="480"
                        ></canvas>
                    </div>
                    {capturedPhoto ? (
                        <div className="flex items-center w-full">
                            <button
                                className="btn !text-[#261E3B] !bg-[#A0A0A0]"
                                onClick={retake}
                            >
                                Re-Take
                            </button>
                            <button className="btn" onClick={finishForm}>
                                {isLoading ? (
                                    <div className="loader"></div>
                                ) : (
                                    "Continue"
                                )}
                            </button>
                        </div>
                    ) : (
                        <button className="btn" onClick={capture}>
                            Capture
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
