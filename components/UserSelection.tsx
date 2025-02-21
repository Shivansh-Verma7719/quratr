import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { createClient } from "@/utils/supabase/client";
import { UserSelect } from "@/components/ui/UserSelect";

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface UserSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUsersSelected: (users: User[]) => void;
  hideCloseButton?: boolean;
}

export const UserSelectionDrawer = ({
  isOpen,
  onClose,
  onUsersSelected,
  hideCloseButton = false,
}: UserSelectionDrawerProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(profiles);
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleUserSelect = (users: User[]) => {
    setSelectedUsers(users);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    if (selectedUsers.length > 0) {
      await onUsersSelected(selectedUsers);
    }
    setIsLoading(false);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={hideCloseButton ? undefined : onClose}
      placement="bottom"
      size="xl"
      hideCloseButton={hideCloseButton}
      isDismissable={!hideCloseButton}
      backdrop="blur"
      classNames={{
        base: "border-t border-white/20",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <h2 className="text-lg font-bold">
                Select Friends for Group Match
              </h2>
              <p className="text-sm text-gray-500">
                Choose friends to find places you all like
              </p>
            </DrawerHeader>

            <DrawerBody className="pb-52">
              <UserSelect
                users={users}
                selectedUsers={selectedUsers}
                onChange={handleUserSelect}
                placeholder="Search friends..."
                className="h-full"
                isDisabled={isLoading}
              />
            </DrawerBody>

            <DrawerFooter className="px-6 py-4">
              <div className="flex w-full gap-4">
                {!hideCloseButton && (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  color="primary"
                  variant="flat"
                  onPress={handleConfirm}
                  isDisabled={isLoading || selectedUsers.length === 0}
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Start Group Match
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
