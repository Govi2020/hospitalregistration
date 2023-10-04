import React, { useRef, useState } from "react";
import AuthHeader from "../../components/AuthHeader";
import InputComponent from "../../components/InputComponent";
import { toast, ToastContainer } from "react-toastify";
import Model from "../../components/Model";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase.js";
import backend from "../../entities/axios"
import { useNavigate } from "react-router-dom";

export default function Register() {
    const hospitalName = useRef();
    const address = useRef();
    const city = useRef();
    const state = useRef();
    const pincode = useRef();
    const registrationDate = useRef();
    const ambulanceAvail = useRef();
    const email = useRef();
    const number = useRef();
    const registrationNumber = useRef();
    const emergencyWard = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const certificateFile = useRef();

    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate(false);

    const onSubmit = (e) => {
        e.preventDefault();

        let isValid = validateData();
        if (isValid) {
            sendRegistrationData();
        }
    };

    const validateData = () => {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        // Certification|Password|Confirm Password Validation
        if (!certificateFile.current?.files[0]) {
            toast.error("A Certificate file should be selected.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } else if (current_value(password) !== current_value(confirmPassword)) {
            toast.error("Passwords Does Not Match.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } else if (!passwordPattern.test(current_value(password))) {
            toast.error(
                "Password requirements: Minimum 8 characters, at least 1 letter and 1 number",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                }
            );
        }else if (current_value(pincode).length < 6) {
            toast.error(
                "Pincode should be 6 numbers",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                }
            )
        }else if (current_value(number).length < 8) {
            toast.error(
                "Phone Number should be 8 numbers",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                }
            )
        } else {
            return true;
        }
        return false;
    };

    const current_value = (ref) => {
        return ref?.current?.value;
    };

    const sendRegistrationData = async () => {
        setIsLoading(true)
        try {
            const storageRef = ref(storage);

            // Get the selected certificate file
            const certificateFileIn = certificateFile.current?.files[0];

            if (!certificateFileIn) {
                // Handle the case where no file is selected
                return;
            }

            // Create a reference to the file in Firebase Storage
            const certificateFileRef = ref(
                storageRef,
                `certificates/${certificateFileIn.name}`
            );

            // Upload the file to Firebase Storage
            await uploadBytes(certificateFileRef, certificateFileIn);

            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(certificateFileRef);

            // Prepare the registration data to send to your server
            const registrationData = {
                hospitalName: current_value(hospitalName),
                address: current_value(address),
                city: current_value(city),
                state: current_value(state),
                pincode: current_value(pincode),
                registrationDate: current_value(registrationDate),
                ambulanceAvail: current_value(ambulanceAvail),
                email: current_value(email),
                number: current_value(number),
                registrationNumber: current_value(registrationNumber),
                emergencyWard: current_value(emergencyWard),
                password: current_value(password),
                confirmPassword: current_value(confirmPassword),
                certificateUrl: downloadURL, // Include the download URL in your data
            };

            // Send a POST request to your server's API endpoint for registration
            const response = await backend.post(
                "auth/register",
                registrationData
            );

            // Handle the response from your server
            if (response.status === 201) {
                setIsModelOpen(true); // Show the success modal
                setTimeout(() => {
                    navigate("")
                }, 1000);
            } else {
                toast.error(
                    "Sorry Some Error Occurred",
                    {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                    }
                );
            }
        } catch (error) {
            console.error("Error registering hospital:", error);
            let message = ""
            if (error?.response?.data?.message){
                message = error?.response?.data?.message
            }else {
                message = "Error registering hospital";
            }
            toast.error(
                message,
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                }
            );
            // Handle any API request errors (e.g., display an error message)
        }finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full min-h-screen pt-20 px-20">
            <AuthHeader />
            <form
                className="p-10 flex flex-col items-center justify-center"
                onSubmit={onSubmit}
            >
                <div className="flex flex-row gap-x-10 w-full">
                    <div className="flex flex-col w-full">
                        <InputComponent
                            placeholder="Hospital Name"
                            ref={hospitalName}
                        />
                        <InputComponent placeholder="Address" ref={address} />
                        <InputComponent placeholder="City" ref={city} />
                        <InputComponent placeholder="State" ref={state} />
                        <InputComponent
                            placeholder="Pincode"
                            type="number"
                            ref={pincode}
                        />
                        <InputComponent
                            placeholder="Hospital Registration Date"
                            type="date"
                            ref={registrationDate}
                        />
                        <InputComponent
                            placeholder="No. of Ambulance Available"
                            type="number"
                            ref={ambulanceAvail}
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <InputComponent
                            placeholder="Email ID"
                            type="email"
                            ref={email}
                        />
                        <InputComponent
                            placeholder="Phone Number"
                            type="tel"
                            ref={number}
                        />
                        <InputComponent
                            placeholder="Hospital Registration Number"
                            type="number"
                            ref={registrationNumber}
                        />
                        <InputComponent
                            placeholder="Emergency-Ward Number"
                            type="number"
                            ref={emergencyWard}
                        />
                        <InputComponent
                            placeholder="Registration Certificate Upload"
                            type="file"
                            ref={certificateFile}
                        />
                        <InputComponent
                            placeholder="Create Password"
                            type="password"
                            ref={password}
                        />
                        <InputComponent
                            placeholder="Confirm Password"
                            type="password"
                            ref={confirmPassword}
                        />
                    </div>
                </div>
                <button className="btn" type="submit">
                    {isLoading ? <><div className="loader"></div></> : 'Sign Up'}
                </button>

                <Model
                    isOpen={isModelOpen}
                    onClose={() => {
                        setIsModelOpen(false);
                    }}
                >
                    <img src="/checkmark.png" alt="" />
                    <h3 className="text-3xl text-[#505050]">
                        Your Registration has been Successful
                    </h3>
                </Model>
                <ToastContainer />
            </form>
        </div>
    );
}
