import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, Chip } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { User } from "@/components/UserSelectionModal";
import { cn } from "@/lib/utils";

interface UserSelectProps {
  users: User[];
  selectedUsers: User[];
  onChange: (users: User[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const UserSelect = ({
  users,
  selectedUsers,
  onChange,
  placeholder = "Search users...",
  className,
  disabled = false,
}: UserSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Updated filter logic to search across all user fields
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower)
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUser = (user: User) => {
    const isUserSelected = selectedUsers.some((u) => u.id === user.id);

    if (isUserSelected) {
      // Remove user if already selected
      onChange(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      // Add user to selection
      onChange([...selectedUsers, user]);
    }

    setSearchQuery("");
  };

  const removeUser = (user: User) => {
    const newSelectedUsers = selectedUsers.filter((u) => u.id !== user.id);
    onChange(newSelectedUsers);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      searchQuery === "" &&
      selectedUsers.length > 0
    ) {
      const newSelectedUsers = selectedUsers.slice(0, -1);
      onChange(newSelectedUsers);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full font-sans",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[100%] z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-500 bg-background shadow-lg dark:border-gray-600"
          >
            <div className="max-h-60 overflow-auto">
              {filteredUsers.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.div
                    key={`user.id-${index}`}
                    onClick={() => toggleUser(user)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 px-4 py-3",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      selectedUsers.find((u) => u.id === user.id) &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <Avatar
                      size="sm"
                      name={user.first_name + " " + user.last_name}
                      getInitials={(name) =>
                        name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                      }
                      showFallback
                      isBordered
                      color="secondary"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">@{user.username}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "min-h-[42px] w-full rounded-xl border border-gray-500 bg-background dark:border-gray-600",
          "flex items-center justify-between px-3 py-2",
          "focus-within:ring-2 focus-within:ring-primary/50"
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          <AnimatePresence>
            {selectedUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
              >
                <Chip
                  variant="flat"
                  color="secondary"
                  size="lg"
                  onClose={() => removeUser(user)}
                  avatar={
                    <Avatar
                      size="sm"
                      name={user.first_name + " " + user.last_name}
                      getInitials={(name) =>
                        name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                      }
                      showFallback
                      color="secondary"
                    />
                  }
                >
                  {user.username}
                </Chip>
              </motion.div>
            ))}
          </AnimatePresence>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedUsers.length === 0 ? placeholder : ""}
            className="min-w-[80px] flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="cursor-pointer"
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </div>
    </div>
  );
};
