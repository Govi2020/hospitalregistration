import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        setIsLoading(true);
        try {
            await logout();
            navigate("/login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <nav className="flex items-center bg-[#201A31]">
            <div className="max-w-[1174px] px-[50px] w-full mx-auto py-2 flex items-center justify-between">
                <div className="flex items-center justify-start h-full">
                    <img
                        src="/logo-small.png"
                        alt=""
                        className="w-[64px] aspect-square"
                    />
                    <img src="/logo.png" alt="" className="w-[132px]" />
                </div>
                <div className="flex items-center w-full justify-end gap-6">
                    <div className="flex items-center gap-2">
                        <img
                            src={user?.imageUrl}
                            className="w-[40px] aspect-square rounded-full"
                            alt="user"
                        />
                        <span className="text-white">{user?.accessCode}</span>
                    </div>
                    <button
                        className="shadow-[4px_4px_10px_0px_rgba(0,0,0,0.25)] rounded-[10px] bg-[#302a41] text-white px-6 py-2"
                        onClick={onClick}
                    >
                        {isLoading ? (
                            <div className="loader"></div>
                        ) : (
                            "Log out"
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
