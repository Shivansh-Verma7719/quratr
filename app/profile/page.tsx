"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchUserProfile, fetchUserPosts, UserProfile, Post } from "./helpers";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Spinner } from "@nextui-org/react";

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
          fetchUserPosts()
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
      <div className="flex items-center justify-center h-[calc(100vh_-_123px)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start py-7 px-5 min-h-screen w-full bg-background">
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
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      @{userProfile.username}
                    </h4>
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

        <h2 className="text-2xl font-bold mb-4 text-center">Your Posts</h2>
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
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">
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
                      className="object-cover rounded-xl w-full h-full"
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
            className="flex flex-col items-center justify-center mt-10"
          >
            <p className="text-xl mb-4">You haven&apos;t made any posts yet.</p>
            <Link href="/feed/new">
              <Button color="primary" variant="flat" size="lg" startContent={<Plus />}>
                Create New Post
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
