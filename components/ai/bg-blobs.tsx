import React from 'react'

export default function Blobs() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div
                className="absolute top-0 -left-10 h-[300px] w-[300px] lg:h-[400px] lg:w-[400px] rounded-full bg-primary/40 dark:bg-primary/25 blur-[60px]"
            />
            <div
                className="absolute right-0 bottom-0 h-[300px] w-[300px] lg:h-[500px] lg:w-[500px] rounded-full bg-secondary/40 dark:bg-secondary/30 blur-[70px]"
            />
            <div
                className="absolute top-1/3 right-1/4 h-[200px] w-[200px] rounded-full bg-blue-400/30 dark:bg-blue-500/20 blur-[50px]"
            />
        </div>
    )
}
