import React from "react";
import { Card, CardHeader, CardBody, Avatar, Button, Chip, Divider } from "@heroui/react";
import { Settings, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ShareButton } from "@/components/Share";
import { UserProfile } from "@/app/profile/helpers";

interface ProfileCardProps {
  userProfile: UserProfile;
  isCurrentUser: boolean;
  isEditable?: boolean;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userProfile,
  isCurrentUser,
  isEditable = true,
  className = "",
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
      <CardHeader className="justify-between">
        <div className="flex w-full justify-between">
          <div className="flex w-full flex-col items-start justify-center gap-1">
            <div className="flex w-full flex-row items-center justify-start p-1">
              <Avatar
                isBordered
                className="mr-3 transition-transform"
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
                size="md"
              />
              <div>
                <h4 className="text-lg ml-1 font-semibold text-default-600 flex items-center">
                  @{userProfile.username}
                  {/* {isCurrentUser && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )} */}
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
        </div>
      </CardBody>
    </Card>
  );
};