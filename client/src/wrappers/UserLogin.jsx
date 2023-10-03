import React, { useEffect } from "react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "../components/Loading";
import { useAuth } from "../contexts/AuthContext";
import backend from "../entities/axios"

export default function UserLogin() {
    const { user, changeUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await backend.post(
                    import.meta.env.VITE_BACKEND_URL + "auth/me",
                    {},
                    { withCredentials: true }
                );
                if (response.status !== 200) {
                    navigate("/login");
                } else {
                    changeUser(response.data);
                    console.log(response.data);
                }
            } catch {
                navigate("/login");
            }finally {
                setIsLoading(false);
            }
        };

        if (!user) {
            setIsLoading(true);
            getUser();
        }else {
            setIsLoading(false)
        }
    }, []);

    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Outlet />
                </>
            )}
            <ToastContainer/>
        </div>
    );
}
