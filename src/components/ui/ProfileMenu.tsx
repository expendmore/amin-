"use client";

import React from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Settings, CreditCard, LogOut, User } from "lucide-react";
import { useModal } from "@/store/use-modal";
import { useToast } from "@/store/use-toast";
import { signOutUser } from "@/app/actions/auth";
import Avatar from "@/components/ui/Avatar";

export interface ProfileMenuProps {
  isCollapsed?: boolean;
  showLabel?: boolean;
}

export function ProfileMenu({ isCollapsed = false, showLabel = true }: ProfileMenuProps) {
  const router = useRouter();
  const { openModal } = useModal();
  const { addToast } = useToast();

  const handleLogout = async () => {
    await signOutUser();
    addToast("Logged out successfully", "info");
    router.push("/sign-in");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`flex items-center justify-between p-1 bg-transparent hover:bg-brand-slate dark:hover:bg-surface-container border border-transparent rounded-xl text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-navy/15 select-none cursor-pointer ${
            isCollapsed || !showLabel ? "justify-center h-10 w-10 p-0" : "w-full p-2"
          }`}
          aria-label="Profile User Menu"
        >
          <div className="flex items-center gap-2.5">
            {/* Reusable design system Avatar component */}
            <Avatar
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6occa93lb5PjZq3c6O8z0EqEf2odtUGE38UU1rfHaZF24A5HIxNnuvRH3_IzjJ-YDSgvyVjpe4XROUc63YP1NBZWcEJwPfADXAWShAhuP-L4406vw5hTFgTU8n1gRY0eaM1XaJgDnWJQu7IS1b1R2_ZZV9HVn7r3qAHMuluHozU3prkia3SCwglZsnRvJW2sig_ZN8LswaFsbJFIqOG5EX9dxpV90A7FVKk7x7xqlKVzIzxNysX87oI4Xwm3kC2dgWskSOlrClDTi"
              name="Guest User"
              size="sm"
            />
            {!isCollapsed && showLabel && (
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-brand-navy dark:text-foreground">Guest User</span>
                <span className="text-[10px] text-on-surface-variant/80 font-bold uppercase tracking-wider leading-none mt-0.5">Free Tier</span>
              </div>
            )}
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[200px] p-1.5 bg-white dark:bg-surface border border-brand-border dark:border-border rounded-xl shadow-xl animate-zoom-in text-brand-navy dark:text-foreground"
          sideOffset={8}
          align={showLabel ? "start" : "end"}
        >
          <div className="px-3 py-2 border-b border-brand-border dark:border-border/50 mb-1 select-none">
            <span className="block text-xs font-bold text-brand-navy dark:text-foreground">Guest User</span>
            <span className="block text-[10px] text-on-surface-variant/80 font-medium">guest@aisensy.com</span>
          </div>

          <DropdownMenu.Item
            onClick={() => openModal("upgrade")}
            className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg hover:bg-brand-slate dark:hover:bg-surface-container cursor-pointer focus:outline-none focus:bg-brand-slate dark:focus:bg-surface-container font-medium"
          >
            <CreditCard className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
            <span>Manage Billing</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => router.push("/settings")}
            className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg hover:bg-brand-slate dark:hover:bg-surface-container cursor-pointer focus:outline-none focus:bg-brand-slate dark:focus:bg-surface-container font-medium"
          >
            <Settings className="h-4 w-4 text-on-surface-variant/80 shrink-0" />
            <span>Workspace Settings</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-danger hover:bg-red-500/10 cursor-pointer focus:outline-none focus:bg-red-500/10 font-bold"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log Out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default ProfileMenu;
