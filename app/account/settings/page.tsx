"use client";
import React, { useState } from "react";
import {
    Card,
    CardBody,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Divider,
    Alert
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    LogOut,
    User,
    KeyRound,
    Moon,
    Sun,
    Monitor,
    AlertTriangle,
    ArrowLeft,
    Shield,
    Trash,
    ChevronDown,
    Palette,
    ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { logout, resetAccount } from "./helpers";

export default function SettingsPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {
        isOpen: isResetModalOpen,
        onOpen: onResetModalOpen,
        onClose: onResetModalClose
    } = useDisclosure();

    const {
        isOpen: isLogoutModalOpen,
        onOpen: onLogoutModalOpen,
        onClose: onLogoutModalClose
    } = useDisclosure();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            setError(null);
            await logout();
            router.push("/login");
        } catch (err) {
            console.error("Logout error:", err);
            setError("Failed to log out. Please try again.");
        } finally {
            setIsLoggingOut(false);
            onLogoutModalClose();
        }
    };

    const handleResetAccount = async () => {
        try {
            setIsResetting(true);
            setError(null);
            await resetAccount();
            setSuccess("Account reset successfully.");
        } catch (err) {
            console.error("Reset account error:", err);
            setError("Failed to reset account. Please try again.");
        } finally {
            setIsResetting(false);
            onResetModalClose();
        }
    };

    const getThemeText = () => {
        switch (theme) {
            case "light": return "Light";
            case "dark": return "Dark";
            default: return "System";
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-start bg-background px-5 py-7">
            <div className="w-full max-w-2xl">
                <div className="mb-6 flex items-center">
                    <Button
                        isIconOnly
                        variant="light"
                        as={Link}
                        href="/profile"
                        aria-label="Back to profile"
                        className="mr-2"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-2xl font-bold">Settings</h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="shadow-md">
                        <CardBody className="py-4">
                            <ul className="space-y-2">
                                {/* Account Settings Items */}
                                <li>
                                    <Button
                                        as={Link}
                                        href="/profile/edit"
                                        color="default"
                                        variant="light"
                                        className="w-full justify-between"
                                        startContent={<User size={18} />}
                                        endContent={<ChevronRight size={18} className="rotate-270" />}
                                    >
                                        <span className="flex-grow text-left">Edit Profile</span>
                                    </Button>
                                </li>

                                <li>
                                    <Button
                                        as={Link}
                                        href="/account/reset-password"
                                        color="default"
                                        variant="light"
                                        className="w-full justify-between"
                                        startContent={<KeyRound size={18} />}
                                        endContent={<ChevronRight size={18} className="rotate-270" />}
                                    >
                                        <span className="flex-grow text-left">Update Password</span>
                                    </Button>
                                </li>

                                {/* Theme Dropdown - Only right side is clickable */}
                                <li>
                                    <div className="flex items-center justify-between w-full px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <Palette size={18} />
                                            <span>Theme</span>
                                        </div>
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    variant="light"
                                                    className="h-auto p-0 bg-transparent"
                                                    endContent={<ChevronDown size={16} />}
                                                >
                                                    {getThemeText()}
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                aria-label="Theme options"
                                                selectedKeys={[theme || "system"]}
                                                selectionMode="single"
                                                onSelectionChange={(keys) => {
                                                    const selected = Array.from(keys)[0]?.toString();
                                                    if (selected) setTheme(selected);
                                                }}
                                            >
                                                <DropdownItem key="light" startContent={<Sun size={18} />}>Light</DropdownItem>
                                                <DropdownItem key="dark" startContent={<Moon size={18} />}>Dark</DropdownItem>
                                                <DropdownItem key="system" startContent={<Monitor size={18} />}>System</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </li>

                                <Divider className="my-3" />

                                {/* Danger Zone */}
                                <li>
                                    <Button
                                        color="warning"
                                        variant="light"
                                        className="w-full justify-between"
                                        startContent={<Shield size={18} />}
                                        onPress={onResetModalOpen}
                                    >
                                        <span className="flex-grow text-left">Reset Account</span>
                                    </Button>
                                </li>

                                <li>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        className="w-full justify-between"
                                        startContent={<LogOut size={18} />}
                                        onPress={onLogoutModalOpen}
                                    >
                                        <span className="flex-grow text-left">Logout</span>
                                    </Button>
                                </li>
                            </ul>
                        </CardBody>
                    </Card>

                    {error && (
                        <Alert color="danger" title={error} className="mt-4"/>
                    )}
                    {success && (
                        <Alert color="success" title={success} className="mt-4"/>
                    )}
                </motion.div>
            </div>

            {/* Reset Account Confirmation Modal */}
            <Modal isOpen={isResetModalOpen} onClose={onResetModalClose}>
                <ModalContent>
                    <ModalHeader className="flex items-center gap-2 text-danger">
                        <AlertTriangle />
                        <span>Reset Account</span>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            This action will reset your preferences by removing all your liked and disliked places.
                        </p>
                        <p className="mt-2 font-semibold">
                            This action cannot be undone. Are you sure you want to proceed?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onResetModalClose}>
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleResetAccount}
                            isLoading={isResetting}
                            startContent={!isResetting && <Trash size={16} />}
                        >
                            Reset Account
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal isOpen={isLogoutModalOpen} onClose={onLogoutModalClose}>
                <ModalContent>
                    <ModalHeader className="flex items-center gap-2">
                        <LogOut />
                        <span>Logout</span>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            Are you sure you want to log out? You will need to log in again to access your account.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onLogoutModalClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleLogout}
                            isLoading={isLoggingOut}
                            startContent={!isLoggingOut && <LogOut size={16} />}
                        >
                            Logout
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}