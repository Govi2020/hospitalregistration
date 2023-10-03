import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import axios from 'axios'

export default function AuthWrapper({ com }) {
    const { user } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    return <React.Fragment>{com}</React.Fragment>;
}
