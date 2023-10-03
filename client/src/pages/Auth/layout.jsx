import React, { useEffect } from 'react'
import "./auth.css"
import { Outlet, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'


export default function AuthLayout() {

    const {user} = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [])

    return (
        <div className="auth w-full h-full flex gap-0">
            <div className="left w-[541px] min-h-screen h-auto flex items-center justify-center flex-col">
                <img src="/logo-main.png" className="w-[270px] h-[322px]" alt="" />
                <img src="/logo.png" className="w-[270px] h-[64px]" alt="" />
                <h2 className="mt-10 text-white text-3xl font-bold">Feel <span className="text-[#00D347]">Safe</span> Everywhere</h2>
                <p className="mt-10 text-white text-2xl font-bold">#Safe-<span className="text-[#00D347]">T</span>-Fast</p>
            </div>
            <Outlet />
            <ToastContainer />
        </div>
    )
}
