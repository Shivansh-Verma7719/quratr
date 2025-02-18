import React, { useState } from "react";
import { motion } from "motion/react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "@/components/interactions/LikeButton";

export interface Post {
  id: string;
  username: string;
  content: string;
  image: string;
  created_at: string;
  reaction_count: number;
}

interface PostProps {
  post: Post;
  index: number;
  likePost: (postId: string) => void;
  dislikePost: (postId: string) => void;
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
            <div className="flex flex-row items-center justify-center p-1">
              <Avatar
                isBordered
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
              <h4 className="text-medium font-semibold leading-none text-default-600 dark:text-white">
                @{post.username}
              </h4>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-medium text-default-500 dark:text-default-400">
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
