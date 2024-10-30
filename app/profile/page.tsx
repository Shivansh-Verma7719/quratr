"use client";
import React, { useState, useEffect } from "react";
import { Providers } from "@/app/providers";
// import CustomNavbar from "@/components/navbar";
// import BottomNav from "@/components/bottomnav";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
// import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchUserProfile, fetchUserPosts, UserProfile, Post } from "./helpers";
import Link from "next/link";

export default function ProfilePage() {
  // const [isMobile, setIsMobile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    // const checkIsMobile = () => setIsMobile(window.innerWidth < 748);
    // checkIsMobile();
    // window.addEventListener("resize", checkIsMobile);

    const loadProfileData = async () => {
      const profile = await fetchUserProfile();
      setUserProfile(profile);

      const posts = await fetchUserPosts();
      setUserPosts(posts);
    };

    loadProfileData();

    // return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <Providers>
      {/* {!isMobile && <CustomNavbar />} */}
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
                  <div className="flex flex-col gap-2">
                    <Button
                      as="a"
                      href="/profile/edit"
                      color="primary"
                      radius="full"
                      size="sm"
                      variant="flat"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      as="a"
                      href="/logout" // Update this to the correct logout URL or function
                      color="secondary"
                      radius="full"
                      size="sm"
                      variant="flat"
                    >
                      Logout
                    </Button>
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
            <div className="flex flex-col items-center justify-center mt-10">
              <p className="text-xl mb-4">You haven&apos;t made any posts yet.</p>
              <Link href="/feed/new">
                <Button color="primary" variant="flat" size="lg">
                  Create New Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* {isMobile && <BottomNav />} */}
    </Providers>
  );
}
