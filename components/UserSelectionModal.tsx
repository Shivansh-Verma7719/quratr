// components/UserSelectionModal.tsx
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { createClient } from "@/utils/supabase/client";
import { Spinner } from "@heroui/spinner";
import { UserSelect } from "@/components/ui/UserSelect";

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsersSelected: (users: User[]) => void;
  hideCloseButton?: boolean;
}

export const UserSelectionModal = ({
  isOpen,
  onClose,
  onUsersSelected,
  hideCloseButton = false,
}: UserSelectionModalProps) => {
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

  // Update handleUserSelect to handle array of users
  const handleUserSelect = (users: User[]) => {
    setSelectedUsers(users);
  };

  const handleModalClose = () => {
    // Only allow closing if it's not the initial selection
    if (!hideCloseButton) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    if (selectedUsers.length > 0) {
      await onUsersSelected(selectedUsers);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      hideCloseButton={hideCloseButton}
      isDismissable={!hideCloseButton}
      backdrop="blur"
      size="xl"
      classNames={{
        base: "border-1 border-white/20",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Select Friends for Group Match</h2>
          <p className="text-sm text-gray-500">
            Choose friends to find places you all like
          </p>
        </ModalHeader>
        <ModalBody className="min-h-[400px] flex-grow">
          {" "}
          {/* Added min-height */}
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner color="primary" size="lg" />
            </div>
          ) : (
            <UserSelect
              users={users}
              selectedUsers={selectedUsers}
              onChange={handleUserSelect}
              placeholder="Search friends..."
              className="h-full" // Ensure UserSelect takes full height
            />
          )}
        </ModalBody>
        <ModalFooter>
          {!hideCloseButton && (
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
          )}
          <Button
            color="primary"
            variant="flat"
            onPress={handleConfirm}
            isDisabled={isLoading || selectedUsers.length === 0}
            isLoading={isLoading}
          >
            Start Group Match
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
