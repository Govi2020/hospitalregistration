import React from "react";
import { NavLink } from "react-router-dom";

export default function AuthHeader() {
    const linkStyle = ({ isActive, isPending }) => {
        return `text-3xl ${
            isActive ? "text-[#261E3B]" : "text-[#CDCDCD]"
        } font-semibold`;
    };

    return (
        <div className="flex items-center justify-center">
            <img
                src="/medical.png"
                className="aspect-square w-[98px]"
                alt="medical logo"
            />
            <div className="flex items-center w-full flex-grow justify-center">
                <NavLink
                    to="/register"
                    className={linkStyle}
                >
                    Sign Up
                </NavLink>
                <span className="text-3xl text-[#CDCDCD] mx-4">/</span>
                <NavLink
                    to="/login"
                    className={linkStyle}
                >
                    Login
                </NavLink>
            </div>
        </div>
    );
}
