"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "cn";
import { useLogout } from "@/features/auth/mutations";
import { Spinner } from "@/components/ui/spinner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const logout = useLogout();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const initials = (user.name || "U").slice(0, 2).toUpperCase();
  const isDark = mounted ? resolvedTheme === "dark" : false;

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/login"),
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={user.name}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
              />
            }
          >
            <Avatar className="size-8 shrink-0 group-data-[collapsible=icon]:size-7">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "top"}
            align="start"
            sideOffset={8}
            className="bg-background mb-2 w-56"
          >
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar size="lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1">
                <span className="truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                closeOnClick={false}
                onClick={toggleTheme}
                className="cursor-pointer justify-between"
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <MoonIcon className="size-4" />
                  ) : (
                    <SunIcon className="size-4" />
                  )}
                  <span>{isDark ? "Dark" : "Light"}</span>
                </div>
                <div
                  className={cn(
                    "flex h-4 w-8 items-center rounded-full p-0.5 transition-colors duration-200",
                    isDark ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-700"
                  )}
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      "size-3.5 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out",
                      isDark ? "translate-x-3.5" : "translate-x-0"
                    )}
                  />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              className="font-semibold"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              {logout.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <LogOutIcon />
              )}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
