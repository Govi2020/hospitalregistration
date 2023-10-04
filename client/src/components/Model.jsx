import React, { useState } from "react";

function Model({ isOpen, onClose, children }) {
    const popupStyle = {
        display: isOpen ? "flex" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50" style={popupStyle}>
            <div className="absolute top-0 left-0 w-full h-full" onClick={onClose}></div>
            <div className="popup-content bg-white p-5 rounded-lg max-w-[720px] max-h-[200px] w-full h-full flex flex-col items-center justify-center gap-y-4">{children}</div>
        </div>
    );
}


export default Model;
