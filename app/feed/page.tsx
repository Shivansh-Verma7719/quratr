"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { fetchPosts, Post } from "./helpers";
import { motion } from "framer-motion";
import { Avatar, Spinner } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // comment

  useEffect(() => {
    fetchMorePosts();
  }, []);

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
      {/* {!isMobile && <CustomNavbar />} */}

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh_-_123px)]">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex justify-center items-start px-5 h-full w-full md:max-w-2xl md:mx-auto">
          <div className="w-full">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-6 md:mb-0 mt-10 md:mt-10"
              >
                <Card className="w-full">
                  <CardHeader className="justify-between">
                    <div className="flex gap-5">
                      <div className="flex flex-row p-1 items-center justify-center">
                        <Avatar
                          isBordered
                          as="button"
                          className="transition-transform mr-2"
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
            ))}
            {!hasMore && (
              <p className="text-center mt-2">
                <b>Yay! You have seen it all</b>
              </p>
            )}
          </div>
        </div>
      )}
      <div className="fixed left-1/2 -translate-x-1/2 top-[3.5rem]">
        <motion.div
          className="bg-[#fed4e4] text-black p-3 sm:p-4 rounded-full shadow-lg cursor-pointer"
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
          <ArrowRight className="transform rotate-[-90deg] w-5 h-5 sm:w-6 sm:h-6" />
        </motion.div>
      </div>
    </>
  );
}
