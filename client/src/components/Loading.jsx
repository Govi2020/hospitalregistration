import React from 'react'

export default function Loading() {
    return (
        <div className="w-full h-screen flex items-center justify-center text-4xl flex-col">
            <img src="/loader.gif" alt="" />
            <span>Backend Hosted on Render.Might take little time to load up</span>
        </div>
    )
}
