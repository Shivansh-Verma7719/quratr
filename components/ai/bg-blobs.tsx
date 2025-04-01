import React from 'react'
import { motion } from 'framer-motion'

export default function Blobs() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute top-0 -left-10 h-[200px] w-[200px] lg:h-[400px] lg:w-[400px] rounded-full bg-primary/40 dark:bg-primary/25 blur-[60px]"
                animate={{
                    x: [0, 20, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute right-0 bottom-0 h-[200px] w-[200px] lg:h-[500px] lg:w-[500px] rounded-full bg-secondary/40 dark:bg-secondary/30 blur-[70px]"
                animate={{
                    x: [0, -30, 15, 0],
                    y: [0, 20, -30, 0],
                    scale: [1, 0.9, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute top-1/3 right-1/4 h-[200px] w-[200px] rounded-full bg-blue-400/30 dark:bg-blue-500/20 blur-[50px]"
                animate={{
                    x: [0, 30, -15, 0],
                    y: [0, -20, 30, 0],
                    scale: [1, 1.1, 0.95, 1]
                }}
                transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 1 }}
            />
        </div>
    )
}
