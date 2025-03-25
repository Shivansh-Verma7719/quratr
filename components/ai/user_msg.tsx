import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Avatar } from "@heroui/react";

interface UserMessageProps {
  content: string;
  className?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  content,
  className = "",
  avatar,
  firstName = "",
  lastName = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, x: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 120,
        mass: 0.8
      }}
      className={`flex justify-end relative ${className}`}
    >
      {/* User Avatar */}
      <div className="absolute right-2 -top-4 h-7 w-7 rounded-full flex items-center justify-center overflow-hidden bg-primary shadow-sm">
        {avatar ? (
          <Avatar
            src={avatar}
            alt={`${firstName} ${lastName}`}
            className="h-full w-full"
            showFallback
            color="primary"
            imgProps={{
              referrerPolicy: "no-referrer",
            }}
            name={`${firstName} ${lastName}`}
            getInitials={(name) => name?.split(" ").map((n) => n[0]).join("")}
            size="sm"
          />
        ) : (
          <User className="h-3.5 w-3.5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%] mb-2 rounded-2xl p-3 pt-4 shadow-sm bg-primary/95 text-white ml-auto">
        <p className="text-sm">{content}</p>
      </div>
    </motion.div>
  );
};

export default UserMessage;