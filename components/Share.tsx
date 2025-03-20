"use client";
import React from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    iconSize?: number;
    className?: string;
    id?: string;
}

export const ShareButton = ({
    title,
    text,
    url,
    iconSize = 20,
    className = "",
}: ShareButtonProps) => {
    // If no URL is provided, use the current page URL
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    const handleShareClick = async () => {
        // This ensures the sharing happens directly as a result of user interaction
        console.log("Share button clicked");
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: shareUrl,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        }
    };

    return (
        <button
            className={`relative inline-flex items-center justify-center p-2 rounded-md transition-colors bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none ${className}`}
            aria-label="Share"
            onClick={handleShareClick}
        >
            <Share2 size={iconSize} />
        </button>
    );
};