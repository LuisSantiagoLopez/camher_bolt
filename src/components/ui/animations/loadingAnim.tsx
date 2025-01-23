import React from 'react'

export default function LoadingAnim() {
    return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-camherdarkyellow min-w-screen">
        <div className="flex space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
        </div>
    </div>
    )
}   