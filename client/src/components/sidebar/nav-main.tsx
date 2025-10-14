import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavGroup, NavMainItem } from "@/config/sidebar-items";

type NavMainProps = {
  readonly items: readonly NavGroup[];
};

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">Soon</span>
);

const NavItemExpanded = ({
  item,
  isActive,
  isSubmenuOpen,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
  isSubmenuOpen: (subItems?: NavMainItem["subItems"]) => boolean;
}) => (
  <Collapsible
    asChild
    className="group/collapsible"
    defaultOpen={isSubmenuOpen(item.subItems)}
    key={item.title}
  >
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        {item.subItems ? (
          <SidebarMenuButton
            disabled={item.comingSoon}
            isActive={isActive(item.url, item.subItems)}
            tooltip={item.title}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.comingSoon && <IsComingSoon />}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        ) : (
          <SidebarMenuButton
            aria-disabled={item.comingSoon}
            asChild
            isActive={isActive(item.url)}
            tooltip={item.title}
          >
            <Link target={item.newTab ? "_blank" : undefined} to={item.url}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.comingSoon && <IsComingSoon />}
            </Link>
          </SidebarMenuButton>
        )}
      </CollapsibleTrigger>
      {item.subItems && (
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  aria-disabled={subItem.comingSoon}
                  asChild
                  isActive={isActive(subItem.url)}
                >
                  <Link target={subItem.newTab ? "_blank" : undefined} to={subItem.url}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                    {subItem.comingSoon && <IsComingSoon />}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      )}
    </SidebarMenuItem>
  </Collapsible>
);

const NavItemCollapsed = ({
  item,
  isActive,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
}) => (
  <SidebarMenuItem key={item.title}>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          disabled={item.comingSoon}
          isActive={isActive(item.url, item.subItems)}
          tooltip={item.title}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          <ChevronRight />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-50 space-y-1" side="right">
        {item.subItems?.map((subItem) => (
          <DropdownMenuItem asChild key={subItem.title}>
            <SidebarMenuSubButton
              aria-disabled={subItem.comingSoon}
              asChild
              className="focus-visible:ring-0"
              isActive={isActive(subItem.url)}
              key={subItem.title}
            >
              <Link target={subItem.newTab ? "_blank" : undefined} to={subItem.url}>
                {subItem.icon && <subItem.icon className="[&>svg]:text-sidebar-foreground" />}
                <span>{subItem.title}</span>
                {subItem.comingSoon && <IsComingSoon />}
              </Link>
            </SidebarMenuSubButton>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
);

export function NavMain({ items }: NavMainProps) {
  const location = useLocation();
  const { state, isMobile } = useSidebar();

  const isItemActive = (url: string, subItems?: NavMainItem["subItems"]) => {
    if (subItems?.length) {
      return subItems.some((sub) => location.pathname.startsWith(sub.url));
    }
    return location.pathname === url;
  };

  const isSubmenuOpen = (subItems?: NavMainItem["subItems"]) =>
    subItems?.some((sub) => location.pathname.startsWith(sub.url)) ?? false;

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu />
        </SidebarGroupContent>
      </SidebarGroup>
      {items.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {group.items.map((item) => {
                if (state === "collapsed" && !isMobile) {
                  // If no subItems, just render the button as a link
                  if (!item.subItems) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          aria-disabled={item.comingSoon}
                          asChild
                          isActive={isItemActive(item.url)}
                          tooltip={item.title}
                        >
                          <Link target={item.newTab ? "_blank" : undefined} to={item.url}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                  // Otherwise, render the dropdown as before
                  return <NavItemCollapsed isActive={isItemActive} item={item} key={item.title} />;
                }
                // Expanded view
                return (
                  <NavItemExpanded
                    isActive={isItemActive}
                    isSubmenuOpen={isSubmenuOpen}
                    item={item}
                    key={item.title}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
