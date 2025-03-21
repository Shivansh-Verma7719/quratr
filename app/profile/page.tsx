"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { fetchUserProfile, fetchUserPosts, UserProfile } from "./helpers";
import Post from "@/types/post"
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { Spinner, Avatar } from "@heroui/react";
import { PostCard } from "@/components/ui/Post";
import { MobileThemeSwitcher } from "@/components/MobileThemeSwitcher";
import { likePost, unlikePost } from "../feed/helpers";
import { ShareButton } from "@/components/Share";

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
      <div className="flex h-[calc(100vh_-_123px)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const getProfileShareUrl = (userId: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/profile/${userId}`;
  };

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
                {/* Avatar and user info section */}
                <div className="flex w-full justify-between">
                  <div className="flex w-full flex-col items-start justify-center gap-1">
                    <div className="flex w-full flex-row items-center justify-start p-1">
                      <Avatar
                        isBordered
                        as="button"
                        className="mr-3 transition-transform"
                        color="primary"
                        src={userProfile.avatar}
                        alt={userProfile.first_name + " " + userProfile.last_name}
                        showFallback
                        name={userProfile?.first_name + " " + userProfile?.last_name}
                        getInitials={(name) =>
                          name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                        }
                        imgProps={{
                          referrerPolicy: "no-referrer",
                        }}
                        size="sm"
                      />
                      <h4 className="text-md font-semibold text-default-600">
                        @{userProfile.username}
                      </h4>
                    </div>
                    <h5 className="text-md tracking-tight text-default-600">
                      {userProfile.email}
                    </h5>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ShareButton
                      title={`${userProfile.first_name} ${userProfile.last_name}'s Profile`}
                      text={`Check out ${userProfile.first_name} ${userProfile.last_name}'s profile on Quratr!`}
                      url={getProfileShareUrl(userProfile.id)}
                      iconSize={20}
                    />
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
                <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                  <Chip color={userProfile.is_onboarded ? "success" : "danger"}>
                    {userProfile.is_onboarded
                      ? "Onboarding complete"
                      : "Onboarding incomplete"}
                  </Chip>

                  <MobileThemeSwitcher />
                </div>
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