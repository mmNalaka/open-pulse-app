import {
  AudioWaveform,
  Banknote,
  GalleryVerticalEnd,
  Gauge,
  Globe,
  HomeIcon,
  List,
  type LucideIcon,
  Mail,
  MouseIcon,
  ReceiptText,
  Users,
} from "lucide-react";

export type NavSubItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
};

export type NavMainItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
};

export type NavGroup = {
  id: number;
  label?: string;
  items: NavMainItem[];
};

// Static sidebar items template - used to generate organization-aware URLs
const sidebarItemsTemplate: NavGroup[] = [
  {
    id: 1,
    items: [
      {
        title: "Home",
        url: "/dashboard",
        icon: HomeIcon,
      },
      {
        title: "Events",
        url: "/events",
        icon: MouseIcon,
      },
      {
        title: "Visitors",
        url: "/visitors",
        icon: Users,
      },
      {
        title: "Sites",
        url: "/sites",
        icon: Globe,
      },
      {
        title: "Performance",
        url: "/performance",
        icon: List,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: Gauge,
      },
      {
        title: "Errors",
        url: "/errors",
        icon: Banknote,
        comingSoon: true,
      },
    ],
  },
  {
    id: 2,
    label: "Account",
    items: [
      {
        title: "Notifications",
        url: "/dashboard/coming-soon",
        icon: Mail,
        comingSoon: true,
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Billing",
        url: "/dashboard/coming-soon",
        icon: ReceiptText,
        comingSoon: true,
      },
    ],
  },
];

/**
 * Generates sidebar items with organization-aware URLs
 * @param orgSlug - The organization slug to prefix URLs with
 * @returns NavGroup[] with organization-prefixed URLs
 */
export function getSidebarItems(orgSlug: string): NavGroup[] {
  return sidebarItemsTemplate.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      url: `/${orgSlug}${item.url}`,
      subItems: item.subItems?.map((subItem) => ({
        ...subItem,
        url: `/${orgSlug}${subItem.url}`,
      })),
    })),
  }));
}

// Fallback export for backward compatibility (without organization context)
export const sidebarItems: NavGroup[] = sidebarItemsTemplate;

// This is sample data.
export const teamItems = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
];
