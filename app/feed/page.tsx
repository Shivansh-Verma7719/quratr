"use client";
import React, { useState, useEffect } from "react";
// import CustomNavbar from "@/components/navbar";
// import BottomNav from "@/components/bottomnav";
import { Providers } from "@/app/providers";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { fetchPosts, Post } from "./helpers";
import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  // const [scrollY, setScrollY] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMorePosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // setScrollY(window.scrollY);
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
    <Providers>
      {/* {!isMobile && <CustomNavbar />} */}
      <div className="flex justify-center items-start px-5 h-full w-full">
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
                    <div className="flex flex-col p-1 items-start justify-center">
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
          {isLoading && <h4 className="text-center mb-10">Loading...</h4>}
          {!hasMore && (
            <p className="text-center mt-2">
              <b>Yay! You have seen it all</b>
            </p>
          )}
        </div>
      </div>
      {/* <motion.div
        className="fixed bottom-20 sm:bottom-8 right-5 sm:right-8 bg-opacity-60 bg-[#fed4e4] text-black p-3 sm:p-4 rounded-full shadow-lg cursor-pointer"
        style={{
          opacity: scrollY > 200 ? 1 : 0,
          pointerEvents: scrollY > 200 ? "auto" : "none",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowRight className="transform rotate-[-90deg] w-5 h-5 sm:w-6 sm:h-6" />
      </motion.div> */}
    </Providers>
  );
}
