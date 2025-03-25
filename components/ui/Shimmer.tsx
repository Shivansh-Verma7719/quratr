import { CSSProperties, FC, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface ShimmerTextProps {
    messages: string[];
    className?: string;
    shimmerWidth?: number;
    displayTime?: number;
}

export const ShimmerText: FC<ShimmerTextProps> = ({
    messages = ["Loading..."],
    className = "",
    shimmerWidth = 100,
    displayTime = 3,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textMeasureRef = useRef<HTMLDivElement>(null);

    // Calculate maximum width needed for all messages
    useEffect(() => {
        if (!textMeasureRef.current) return;
        
        // Create a hidden element to measure text widths
        const measureElement = document.createElement('div');
        measureElement.style.position = 'absolute';
        measureElement.style.visibility = 'hidden';
        measureElement.style.whiteSpace = 'nowrap';
        measureElement.style.left = '-9999px';
        measureElement.style.font = window.getComputedStyle(textMeasureRef.current).font;
        document.body.appendChild(measureElement);
        
        // Measure each message's width
        let maxWidth = 0;
        messages.forEach(message => {
            measureElement.textContent = message;
            const width = measureElement.getBoundingClientRect().width;
            maxWidth = Math.max(maxWidth, width);
        });
        
        // Add a small buffer
        maxWidth += 16;
        
        // Set container width
        setContainerWidth(maxWidth);
        
        // Clean up
        document.body.removeChild(measureElement);
    }, [messages]);

    // Cycle through messages
    useEffect(() => {
        if (messages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, displayTime * 1000);

        return () => clearInterval(interval);
    }, [messages, displayTime]);

    return (
        <div 
            ref={containerRef}
            className="relative overflow-hidden min-h-[1.5rem]"
            style={{
                width: containerWidth ? `${containerWidth}px` : 'auto',
                transition: 'width 0.5s ease'
            }}
        >
            <div 
                ref={textMeasureRef} 
                className="absolute opacity-0 pointer-events-none"
                aria-hidden="true"
            >
                {messages[currentIndex]}
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    {/* Base text layer */}
                    <span
                        className={cn(
                            "block text-neutral-600/90 dark:text-neutral-300/90",
                            className
                        )}
                    >
                        {messages[currentIndex]}
                    </span>

                    {/* Shimmer overlay */}
                    <span
                        style={{
                            "--shiny-width": `${shimmerWidth}px`,
                        } as CSSProperties}
                        className={cn(
                            "absolute inset-0",
                            "animate-slow-shimmer bg-clip-text text-transparent bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%]",
                            "bg-gradient-to-r from-transparent via-secondary/70 to-primary/70",
                            "pointer-events-none",
                            className
                        )}
                        aria-hidden="true"
                    >
                        {messages[currentIndex]}
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ShimmerText;