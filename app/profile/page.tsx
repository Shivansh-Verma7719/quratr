"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { fetchUserProfile, fetchUserPosts, UserProfile, Post } from "./helpers";
import Link from "next/link";
import { Plus, Edit, Sun, Moon } from "lucide-react";
import { Spinner, Avatar } from "@heroui/react";
import { PostCard } from "@/components/ui/Post";
import { useTheme } from "next-themes";
import { likePost, unlikePost } from "../feed/helpers";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

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
      <div className="flex h-[calc(100vh_-_123px)] items-center justify-center">
        <Spinner size="lg" />
      </div>
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
            <Card className="w-full shadow-md">
              <CardHeader className="justify-between">
                <div className="flex w-full justify-between">
                  <div className="flex w-full flex-col items-start justify-center gap-1">
                    <div className="flex w-full flex-row items-center justify-start p-1">
                      <Avatar
                        isBordered
                        as="button"
                        className="mr-2 transition-transform"
                        color="primary"
                        showFallback
                        name={userProfile.username}
                        getInitials={(name) =>
                          name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                        }
                        size="sm"
                      />
                      <h4 className="text-small font-semibold text-default-600">
                        @{userProfile.username}
                      </h4>
                    </div>
                    <h5 className="text-small tracking-tight text-default-400">
                      {userProfile.email}
                    </h5>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={toggleTheme}
                      aria-label="Toggle theme"
                    >
                      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      as={Link}
                      href="/profile/edit"
                      aria-label="Edit profile"
                    >
                      <Edit size={20} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mb-2">
                  <h2 className="text-xl font-bold">
                    {userProfile.first_name} {userProfile.last_name}
                  </h2>
                </div>
                <Chip color={userProfile.is_onboarded ? "success" : "danger"}>
                  {userProfile.is_onboarded
                    ? "Onboarding complete"
                    : "Onboarding incomplete"}
                </Chip>
              </CardBody>
            </Card>
          </motion.div>
        )}

        <h2 className="mb-6 text-center text-2xl font-bold">Your Posts</h2>

        {userPosts.length > 0 ? (
          <div>
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
              href="/posts/new"
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
