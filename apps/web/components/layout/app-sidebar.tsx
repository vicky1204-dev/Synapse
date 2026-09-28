"use client";

import Image from "next/image";
import {
  BookOpenIcon,
  BookmarkIcon,
  BoxIcon,
  GraduationCapIcon,
  HomeIcon,
  MessageCircleIcon,
  NotebookPenIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain, type NavItem } from "@/components/layout/nav-main";
import { NavUser } from "./nav-user";

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Learn",
    items: [
      { title: "Home", href: "/home", icon: HomeIcon, exact: true },
      { title: "Library", href: "/library", icon: BookOpenIcon },
      { title: "Courses", href: "/courses", icon: GraduationCapIcon },
      { title: "My Study", href: "/study", icon: NotebookPenIcon },
    ],
  },
  {
    label: "Connect",
    items: [
      { title: "Discussions", href: "/discussions", icon: MessageCircleIcon },
    ],
  },
  {
    label: "Personal",
    items: [
      { title: "Saved", href: "/saved", icon: BookmarkIcon },
      { title: "Contributions", href: "/contributions", icon: BoxIcon },
    ],
  },
];

// Placeholder — swap with real session data when auth lands.
const currentUser = {
  name: "Ashutosh Samal",
  email: "ashutosh@synapse.app",
  avatar: "",
};

// ---------------------------------------------------------------------------
// AppSidebar
// ---------------------------------------------------------------------------

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="gap-4 border-none py-4 pl-4"
    >
      <SidebarHeader className="bg-background flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-sm group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
        <Image
          src="/synapse_logo.svg"
          alt="Synapse"
          width={24}
          height={24}
          className="size-6 shrink-0"
          priority
        />
        <span className="text-sidebar-foreground text-base font-medium group-data-[collapsible=icon]:hidden">
          Synapse
        </span>
      </SidebarHeader>

      <SidebarContent>
        <div className="bg-background mt-4 rounded-2xl shadow-sm">
          {navGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <NavMain items={group.items} />
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="bg-background rounded-full px-2 py-2 shadow-sm">
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
