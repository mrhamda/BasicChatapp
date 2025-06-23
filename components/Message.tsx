import React from 'react'

type MessageProps = {
    text: string,
    name: string
}

export function Message({text, name}: MessageProps) {
    return (
        <div className="bg-amber-950 w-full h-full font-bold text-amber-50">
            <div><span className='uppercase'>{name}</span> : <span>{text}</span></div>
        </div>
    )
}
