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
    color?: string;
}

export const ShareButton = ({
    title,
    text,
    url,
    iconSize = 20,
    className = "",
    id = "share-button",
    color = "currentColor"
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
        >
            <button
                id={id}
                className={`inline-flex items-center justify-center p-2 rounded-lg transition-all 
                hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none active:outline-none ${className} w-10 h-10 min-h-10 min-w-10`}
                aria-label="Share"
                type="button"
            >
                <Share2 size={iconSize} color={color} />
            </button>
        </RWebShare>
    );
};