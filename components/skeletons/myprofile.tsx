import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Skeleton, Divider } from "@heroui/react";

interface ProfileSkeletonProps {
  className?: string;
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ className = "" }) => {
  return (
    <Card className={`w-full shadow-md ${className}`}>
      <CardHeader className="justify-between">
        <div className="flex w-full justify-between">
          <div className="flex w-full flex-col items-start justify-center gap-1">
            <div className="flex w-full flex-row items-center justify-start p-1">
              <Skeleton className="rounded-full h-12 w-12 mr-3" />
              <div>
                <Skeleton className="h-5 w-32 rounded-lg mb-1" />
                <Skeleton className="h-4 w-24 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="mb-3">
          <Skeleton className="h-6 w-48 rounded-lg mb-2" />
          <Skeleton className="h-4 w-36 rounded-lg" />
        </div>
        <Divider className="my-3" />
        <div className="flex flex-wrap justify-between items-center gap-2">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </CardBody>
    </Card>
  );
};

export const PostsSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className = "" 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="w-full shadow-md">
          <CardHeader className="pb-0">
            <div className="flex items-center">
              <Skeleton className="rounded-full h-10 w-10 mr-3" />
              <div>
                <Skeleton className="h-5 w-32 rounded-lg mb-1" />
                <Skeleton className="h-4 w-24 rounded-lg" />
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Skeleton className="h-4 w-full rounded-lg mb-2" />
            <Skeleton className="h-4 w-full rounded-lg mb-2" />
            <Skeleton className="h-4 w-3/4 rounded-lg mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export const MyProfilePageSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-background px-5 py-7">
      <div className="w-full max-w-2xl">

        <div className="mb-8">
          <ProfileSkeleton />
        </div>

        <div className="mb-6 flex justify-center">
          <Skeleton className="mx-auto h-8 w-48 rounded-lg" />
        </div>

        <PostsSkeleton count={3} />
      </div>
    </div>
  );
};