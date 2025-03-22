"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip, Button, Spinner, Avatar, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Settings } from "lucide-react";
import { PostCard } from "@/components/ui/Post";
import { MobileThemeSwitcher } from "@/components/MobileThemeSwitcher";
import { likePost, unlikePost } from "../../feed/helpers";
import { fetchUserPostsById } from "../helpers";
import { ShareButton } from "@/components/Share";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { UserProfile } from "../helpers";
import Post from "@/types/post";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
    // Unwrap the params using React.use()
    const params = useParams();
    const id = params.id as string;

    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        const fetchUserProfileById = async (userId: string) => {
            const supabase = createClient();
            const { data: userData } = await supabase.auth.getUser();

            // Check if viewing own profile
            if (userData.user && userData.user.id === userId) {
                setIsCurrentUser(true);
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            return data as UserProfile;
        };

        const loadData = async () => {
            try {
                if (!id) {
                    router.push('/feed');
                    return;
                }

                // Fetch both profile and posts data in parallel
                const [profile, posts] = await Promise.all([
                    fetchUserProfileById(id),
                    fetchUserPostsById(id),
                ]);

                if (profile) {
                    setUserProfile(profile);
                } else {
                    // If no profile is found, redirect to feed
                    router.push('/feed');
                    return;
                }

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
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh_-_123px)] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
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
                        <Card className="w-full shadow-md">
                            <CardHeader className="justify-between">
                                <div className="flex w-full justify-between">
                                    <div className="flex w-full flex-col items-start justify-center gap-1">
                                        <div className="flex w-full flex-row items-center justify-start p-1">
                                            <Avatar
                                                isBordered
                                                className="mr-3 transition-transform"
                                                color="primary"
                                                showFallback
                                                name={userProfile?.first_name + " " + userProfile?.last_name}
                                                getInitials={(name) =>
                                                    name
                                                        ?.split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                }
                                                size="md"
                                            />
                                            <div>
                                                <h4 className="text-md font-semibold text-default-600 flex items-center">
                                                    @{userProfile.username}
                                                    {isCurrentUser && (
                                                        <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                                                            You
                                                        </span>
                                                    )}
                                                </h4>
                                                {isCurrentUser && (
                                                    <h5 className="text-sm tracking-tight text-default-500">
                                                        {userProfile.email}
                                                    </h5>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <ShareButton
                                            title={`${userProfile.first_name} ${userProfile.last_name}'s Profile`}
                                            text={`Check out ${userProfile.first_name} ${userProfile.last_name}'s profile on Quratr!`}
                                            url={`${window.location.origin}/profile/${id}`}
                                            iconSize={20}
                                        />
                                        {isCurrentUser && (
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                as={Link}
                                                href="/account/settings"
                                                aria-label="Edit profile"
                                            >
                                                <Settings size={20} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="mb-3">
                                    <h2 className="text-xl font-bold">
                                        {userProfile.first_name} {userProfile.last_name}
                                    </h2>
                                    <div className="flex mt-1 text-default-500 text-sm">
                                        <Calendar size={14} className="mr-1" />
                                        <span>Joined {format(new Date(userProfile.created_at || Date.now()), 'MMMM yyyy')}</span>
                                    </div>
                                </div>

                                <Divider className="my-3" />

                                <div className="flex flex-wrap justify-between items-center gap-2">
                                    {isCurrentUser && (
                                        <Chip color={userProfile.is_onboarded ? "success" : "danger"}>
                                            {userProfile.is_onboarded
                                                ? "Onboarding complete"
                                                : "Onboarding incomplete"}
                                        </Chip>
                                    )}

                                    <div className={isCurrentUser ? "ml-auto" : "hidden"}>
                                        <MobileThemeSwitcher />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
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
                                href="/posts/new"
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