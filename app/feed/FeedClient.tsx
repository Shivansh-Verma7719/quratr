"use client";
import React, { useState, useEffect } from "react";
import { fetchPosts, Post, likePost, unlikePost } from "./helpers";
import { motion } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { PostCard } from "@/components/ui/Post";
import Link from "next/link";

interface FeedClientProps {
  initialPosts: Post[];
}

export default function FeedClient({ initialPosts }: FeedClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [scrollY, setScrollY] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(posts)
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
      <div className="flex h-full w-full items-start justify-center px-3 md:mx-auto md:max-w-2xl">
        <div className="w-full">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              likePost={likePost}
              dislikePost={unlikePost}
              isLiked={post.isLiked}
            />
          ))}
          {!hasMore && (
            <p className="mb-0 mt-5 text-center md:mb-10">
              <b>Yay! You have seen it all</b>
            </p>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
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

      {/* Create new post button */}
      <motion.div
        className="fixed bottom-14 right-3 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link href="/feed/new">
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-6 w-6 text-white" />
          </motion.div>
        </Link>
      </motion.div>
    </>
  );
}
