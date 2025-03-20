"use client";
import React from "react";
import { Share2 } from "lucide-react";
import { RWebShare } from "react-web-share";

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
    id = "share-button"
}: ShareButtonProps) => {
    // If no URL is provided, use the current page URL
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    return (
        <RWebShare
            data={{
                text: text || "",
                url: shareUrl,
                title: title,
            }}
            // onClick={() => console.log("Share dialog opened")}
        >
            <button
                id={id}
                className={`relative inline-flex items-center justify-center p-2 rounded-md transition-colors bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none ${className}`}
                aria-label="Share"
            >
                <Share2 size={iconSize} />
            </button>
        </RWebShare>
    );
};