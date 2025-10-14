import { useParams } from "@tanstack/react-router";
import type * as React from "react";
import { useMemo } from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getSidebarItems, sidebarItems, teamItems } from "@/config/sidebar-items";
import { SidebarNotifications } from "./sidebar-notifications";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { org } = useParams({ strict: false });
  // Generate organization-aware sidebar items
  const organizationSidebarItems = useMemo(() => {
    if (org) {
      return getSidebarItems(org);
    }
    // Fallback to default items if no organization
    return sidebarItems;
  }, [org]);

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamItems} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={organizationSidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarNotifications />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
