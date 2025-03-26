"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUserProfile, fetchUserPosts, UserProfile } from "./helpers";
import Post from "@/types/post"
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { PostCard } from "@/components/ui/Post";
import { likePost, unlikePost } from "../feed/helpers";
import { MyProfilePageSkeleton } from "@/components/skeletons/myprofile";
import { ProfileCard } from "@/components/ui/Profile";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both profile and posts data in parallel
        const [profile, posts] = await Promise.all([
          fetchUserProfile(),
          fetchUserPosts(),
        ]);

        if (profile) {
          setUserProfile(profile);
        }
        if (posts) {
          setUserPosts(posts);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <MyProfilePageSkeleton />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-background px-5 py-7">
      <div className="w-full max-w-2xl">
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <ProfileCard 
              userProfile={userProfile} 
              isCurrentUser={true}
              isEditable={true}
            />
          </motion.div>
        )}

        <h2 className="mb-6 text-center text-2xl font-bold">Your Posts</h2>

        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                likePost={likePost}
                dislikePost={unlikePost}
                isLiked={post.isLiked}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center rounded-lg bg-default-50 p-10 shadow-sm"
          >
            <p className="mb-4 text-xl">You haven&apos;t made any posts yet.</p>
            <Button
              as={Link}
              href="/feed/new"
              color="primary"
              variant="flat"
              size="lg"
              startContent={<Plus />}
              className="font-medium"
            >
              Create New Post
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}