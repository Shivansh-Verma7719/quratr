"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Camera, X } from "lucide-react";
import { createNewPost } from "./helper";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (postText.trim() === "" || !selectedImage) {
      alert("Please add some text and an image to your post.");
      return;
    }
    try {
      setIsLoading(true);
      const post = await createNewPost(postText, selectedImage);
      if (post === 'success') {
        setPostText("");
        setSelectedImage(null);
        setPreviewUrl(null);
        router.push('/app/profile');
      } else {
        alert("Failed to create post. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center py-2 px-5 min-h-screen w-full bg-background">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background rounded-xl shadow-lg p-6"
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-text">
              Create a New Post
            </h1>
            <Textarea
              placeholder="What's on your mind?"
              value={postText}
              isRequired
              onChange={(e) => setPostText(e.target.value)}
              className="mb-4"
              minRows={3}
              isInvalid={postText.length > 500}
              errorMessage="The text should be at most 500 characters long."
            />
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                className="hidden"
              />
              {previewUrl ? (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full rounded-lg"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <Button
                  color="secondary"
                  variant="flat"
                  startContent={<Camera size={20} />}
                  onPress={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  Add Photo
                </Button>
              )}
            </div>
            <Button
              color="primary"
              variant="flat"
              isDisabled={!postText || !selectedImage}
              isLoading={isLoading}
              onPress={handleSubmit}
              className="w-full"
            >
              Post
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
