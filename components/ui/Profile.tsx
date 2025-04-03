import React from "react";
import { Card, CardHeader, CardBody, Avatar, Button, Chip, Divider } from "@heroui/react";
import { Settings, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ShareButton } from "@/components/Share";
import { UserProfile } from "@/app/profile/helpers";
import { motion } from "framer-motion";

interface ProfileCardProps {
  userProfile: UserProfile;
  isCurrentUser: boolean;
  isEditable?: boolean;
  className?: string;
  userStats?: {
    placesLiked: number;
    placesDisliked: number;
    postsCreated?: number;
  };
}

// Statistic item component for consistent styling - focus on numbers
const StatItem = ({ label, value }: { 
  label: string; 
  value: number;
  color?: "primary" | "success" | "warning" | "danger" | "secondary";
}) => (
  <motion.div 
    className="flex flex-col items-center justify-center"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 500 }}
  >
    <div className={`font-bold text-lg md:text-xl`}>
      {value}
    </div>
    <p className="text-xs font-medium text-default-500 text-center">{label}</p>
  </motion.div>
);

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userProfile,
  isCurrentUser,
  isEditable = true,
  className = "",
  userStats = {
    placesLiked: 0,
    placesDisliked: 0,
    postsCreated: 0,
  },
}) => {
  // Set share content based on whether it's the current user
  const shareTitle = isCurrentUser 
    ? "My Profile on Quratr" 
    : `${userProfile.first_name} ${userProfile.last_name}'s Profile`;
    
  const shareText = isCurrentUser
    ? "Check out my profile on Quratr!"
    : `Check out ${userProfile.first_name} ${userProfile.last_name}'s profile on Quratr!`;

  return (
    <Card className={`w-full shadow-md ${className}`}>
      <CardHeader className="pb-3 pt-5">
        <div className="flex w-full items-center">
          {/* Avatar on the left */}
          <div className="mr-5">
            <Avatar
              isBordered
              color="primary"
              src={userProfile?.avatar}
              showFallback
              name={userProfile?.first_name + " " + userProfile?.last_name}
              getInitials={(name) =>
                name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
              }
              size="lg"
            />
          </div>
          
          {/* Stats in the middle with vertical dividers */}
          <div className="flex flex-1 justify-evenly">
            <StatItem 
              label="Experiences Liked" 
              value={userStats.placesLiked} 
              color="primary"
            />
            
            <StatItem 
              label="Experiences Disliked" 
              value={userStats.placesDisliked} 
              color="danger"
            />
            
            {userStats.postsCreated !== undefined && (
              <StatItem 
                label="Posts" 
                value={userStats.postsCreated} 
                color="warning"
              />
            )}
          </div>
          
          {/* Action buttons on the right */}
          <div className="flex items-center ml-3 space-x-2">
            <ShareButton
              title={shareTitle}
              text={shareText}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${userProfile.username}`}
              iconSize={20}
            />
            {isCurrentUser && isEditable && (
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
        {/* User identification section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            {userProfile.first_name} {userProfile.last_name}
          </h2>
          <h4 className="text-sm text-default-500">
            @{userProfile.username}
          </h4>
          
          {isCurrentUser && (
            <div className="text-sm text-default-500 mt-1">
              {userProfile.email}
            </div>
          )}
        </div>
        
        <div className="flex mt-1 text-default-500 text-sm">
          <Calendar size={14} className="mr-1" />
          <span>Joined {format(new Date(userProfile.created_at || Date.now()), 'MMMM yyyy')}</span>
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
        </div>
      </CardBody>
    </Card>
  );
};