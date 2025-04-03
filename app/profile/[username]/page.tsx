"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/ui/Post";
import { likePost, unlikePost } from "../../feed/helpers";
import { fetchUserPostsById } from "../helpers";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "../helpers";
import Post from "@/types/post";
import { useParams } from "next/navigation";
import { ProfilePageSkeleton } from "@/components/skeletons/profile";
import { ProfileCard } from "@/components/ui/Profile";

export default function UserProfilePage() {
    // Get username from the URL
    const params = useParams();
    const username = params.username as string;

    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        const fetchUserProfileByUsername = async (username: string) => {
            const supabase = createClient();
            const { data: userData } = await supabase.auth.getUser();

            // First, fetch the profile by username
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            // Check if viewing own profile
            if (userData.user && userData.user.id === data.id) {
                setIsCurrentUser(true);
            }

            return data as UserProfile;
        };

        const loadData = async () => {
            try {
                if (!username) {
                    router.push('/feed');
                    return;
                }

                // First, get the profile by username
                const profile = await fetchUserProfileByUsername(username);

                if (!profile) {
                    // If no profile is found, redirect to feed
                    router.push('/feed');
                    return;
                }

                setUserProfile(profile);

                // Then fetch posts using the profile ID
                const posts = await fetchUserPostsById(profile.id);
                if (posts) {
                    setUserPosts(posts);
                }
            } catch (error) {
                console.error("Error loading profile data:", error);
                router.push('/feed');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [username, router]);

    if (isLoading) {
        return <ProfilePageSkeleton />;
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-start bg-background px-5 py-7">
            <div className="w-full max-w-2xl">
                <div className="mb-4 flex items-center">
                    <Button
                        isIconOnly
                        variant="light"
                        as={Link}
                        href="/feed"
                        aria-label="Back to feed"
                        className="mr-2"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-xl font-bold">User Profile</h1>
                </div>

                {userProfile && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <ProfileCard 
                            userProfile={userProfile} 
                            isCurrentUser={isCurrentUser}
                            isEditable={true}
                            userStats={{
                                placesLiked: userProfile.place_likes ?? 0,
                                placesDisliked: userProfile.place_dislikes ?? 0,
                                postsCreated: userPosts.length,
                            }}
                        />
                    </motion.div>
                )}

                <h2 className="mb-6 text-center text-2xl font-bold">
                    {isCurrentUser ? "Your Posts" : `${userProfile?.first_name}'s Posts`}
                </h2>

                {userPosts.length > 0 ? (
                    <div className="space-y-4">
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
                        <p className="mb-4 text-xl">
                            {isCurrentUser
                                ? "You haven't made any posts yet."
                                : `${userProfile?.first_name} hasn't made any posts yet.`}
                        </p>
                        {isCurrentUser && (
                            <Button
                                as={Link}
                                href="/feed/new"
                                color="primary"
                                variant="flat"
                                size="lg"
                                className="font-medium"
                            >
                                Create New Post
                            </Button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}