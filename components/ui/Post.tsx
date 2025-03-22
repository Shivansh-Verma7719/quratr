import React, { useState } from "react";
import { motion } from "motion/react";
import { Avatar, Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "@/components/interactions/LikeButton";
import { Post } from "@/app/feed/helpers";

interface PostProps {
  post: Post;
  index: number;
  likePost: (postId: number) => void;
  dislikePost: (postId: number) => void;
  isLiked: boolean;
}

export const PostCard = ({
  post,
  index,
  likePost,
  dislikePost,
  isLiked,
}: PostProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [reactionCount, setReactionCount] = useState(post.reaction_count);

  const handleLike = async () => {
    try {
      setLiked(true);
      setReactionCount((prev) => prev + 1); // Increment count
      await likePost(post.id);
    } catch (error) {
      // Revert on error
      setLiked(false);
      setReactionCount((prev) => prev - 1);
      console.error("Failed to like post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      setLiked(false);
      setReactionCount((prev) => prev - 1); // Decrement count
      await dislikePost(post.id);
    } catch (error) {
      // Revert on error
      setLiked(true);
      setReactionCount((prev) => prev + 1);
      console.error("Failed to unlike post:", error);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
  });

  return (
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
            <Link
              href={`/profile/${post.profile_username}`}
              className="flex flex-row items-center justify-center p-1 group transition-colors hover:bg-default-100 rounded-lg"
            >
              <Avatar
                isBordered
                className="mr-2 transition-transform group-hover:scale-105"
                color="secondary"
                src={post.profile_avatar!}
                alt={post.profile_username}
                showFallback
                name={post.profile_first_name + " " + post.profile_last_name}
                getInitials={(name) =>
                  name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                }
                imgProps={{
                  referrerPolicy: "no-referrer",
                }}
                size="md"
              />
              <h4 className="text-lg ml-1 font-semibold leading-none text-default-600 dark:text-white group-hover:text-primary-500">
                @{post.profile_username}
              </h4>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-md md:text-lg text-default-600 dark:text-default-400">
          {post.content}
        </CardBody>
        <CardFooter className="flex flex-col p-0">
          {post.image && (
            <Image
              alt="Post image"
              className="mt-2 h-full w-full object-cover"
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/feed_images/${post.image}`}
              width={400}
              height={300}
              quality={100}
            />
          )}
          <div className="flex w-full items-center justify-between px-3">
            <div className="flex flex-row items-center justify-center gap-1">
              <LikeButton
                isLiked={liked}
                onLike={handleLike}
                onUnlike={handleUnlike}
              />
              <p className="text-default-500 dark:text-default-400">
                {reactionCount}
              </p>
            </div>
            <p className="text-left text-sm text-default-500 dark:text-default-400">
              {timeAgo}
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};