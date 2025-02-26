"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchUserProfile, fetchUserPosts, UserProfile, Post } from "./helpers";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { Spinner, Avatar } from "@heroui/react";

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

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-background px-5 py-7">
      <div className="w-full max-w-2xl">
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="w-full">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Edit
                    className="absolute right-4 top-4 cursor-pointer text-default-500 hover:text-default-400"
                    size={20}
                  />
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
                </div>
              </CardHeader>
              <CardBody>
                <p>
                  {userProfile.first_name} {userProfile.last_name}
                </p>
                <Chip color={userProfile.is_onboarded ? "success" : "danger"}>
                  {userProfile.is_onboarded
                    ? "Onboarding complete"
                    : "Onboarding incomplete"}
                </Chip>
              </CardBody>
            </Card>
          </motion.div>
        )}

        <h2 className="mb-4 text-center text-2xl font-bold">Your Posts</h2>
        {userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-6"
            >
              <Card className="w-full">
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <div className="flex flex-row items-center justify-center p-1">
                      <Avatar
                        isBordered
                        as="button"
                        className="mr-2"
                        color="primary"
                        showFallback
                        name={post.username}
                        getInitials={(name) =>
                          name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                        }
                        size="sm"
                      />
                      <h4 className="text-medium font-semibold text-default-600">
                        @{post.username}
                      </h4>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                  <p>{post.content}</p>
                </CardBody>
                <CardFooter className="gap-3">
                  {post.image && (
                    <Image
                      alt="Post image"
                      className="h-full w-full rounded-xl object-cover"
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/feed_images/${post.image}`}
                      width={400}
                      height={300}
                      quality={100}
                    />
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center"
          >
            <p className="mb-4 text-xl">You haven&apos;t made any posts yet.</p>
            <Button
              as={Link}
              href="/posts/new"
              color="primary"
              variant="flat"
              size="lg"
              startContent={<Plus />}
            >
              Create New Post
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
