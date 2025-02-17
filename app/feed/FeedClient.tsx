"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import Image from "next/image";
import { fetchPosts, Post } from "./helpers";
import { motion } from "framer-motion";
import { Avatar } from "@heroui/react";
import { ArrowRight } from "lucide-react";

interface FeedClientProps {
  initialPosts: Post[];
}

export default function FeedClient({ initialPosts }: FeedClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [scrollY, setScrollY] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (!isLoading && hasMore) {
          fetchMorePosts();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const newPosts = await fetchPosts(posts.length, 10);
    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length === 10);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex h-full w-full items-start justify-center px-5 md:mx-auto md:max-w-2xl">
        <div className="w-full">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-6 mt-10 md:mb-0 md:mt-10"
            >
              <Card className="w-full">
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <div className="flex flex-row items-center justify-center p-1">
                      <Avatar
                        isBordered
                        as="button"
                        className="mr-2 transition-transform"
                        color="secondary"
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
                      <h4 className="text-medium font-semibold leading-none text-default-600">
                        @{post.username}
                      </h4>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="px-3 py-0 text-medium text-default-400">
                  {post.content}
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
          ))}
          {!hasMore && (
            <p className="mb-0 mt-5 text-center md:mb-10">
              <b>Yay! You have seen it all</b>
            </p>
          )}
        </div>
      </div>
      <div className="fixed left-1/2 top-[3.5rem] -translate-x-1/2">
        <motion.div
          className="cursor-pointer rounded-full bg-[#fed4e4] p-3 text-black shadow-lg sm:p-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: scrollY > 370 ? 0 : -100,
            opacity: scrollY > 370 ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowRight className="h-5 w-5 rotate-[-90deg] transform sm:h-6 sm:w-6" />
        </motion.div>
      </div>
    </>
  );
}
