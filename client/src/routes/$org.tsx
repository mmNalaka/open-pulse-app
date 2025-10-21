import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

// Regex for validating organization slug format (allow letters, numbers, hyphens, underscores)
const ORG_SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;

export const Route = createFileRoute("/$org")({
  component: OrganizationLayout,
  beforeLoad: ({ params }) => {
    // Validate organization slug parameter
    if (!params.org) {
      throw new Error("Organization slug is required");
    }

    // Additional validation can be added here
    // For example, checking if the slug format is valid
    if (!ORG_SLUG_REGEX.test(params.org)) {
      throw new Error("Invalid organization slug format");
    }

    return {
      org: params.org,
    };
  },
});

function hasUser(val: unknown): boolean {
  if (!val || typeof val !== "object") {
    return false;
  }
  const obj = val as Record<string, unknown>;
  if ("user" in obj && obj.user && typeof obj.user === "object") {
    return true;
  }
  if ("data" in obj && obj.data && typeof obj.data === "object") {
    const data = obj.data as Record<string, unknown>;
    if ("user" in data && data.user && typeof data.user === "object") {
      return true;
    }
  }
  return false;
}

function OrganizationLayout() {
  const { org } = Route.useParams();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  // Show loading state while checking authentication and organization
  if (sessionPending) {
    return (
      <>
        <Sidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="h-full w-full items-center justify-center p-4">
            <Spinner />
          </div>
        </SidebarInset>
      </>
    );
  }

  // Redirect to login if not authenticated
  if (!hasUser(session)) {
    const href = typeof window !== "undefined" ? window.location.href : "/";
    return <Navigate search={{ redirect: href }} to="/login" />;
  }

  const isMember = session?.organizations?.some((organization) => organization.orgId === org);

  // Check if user has access to the requested organization
  if (!isMember) {
    // User is trying to access an organization they don't have access to
    // Redirect to their active organization
    const orgId = session?.organizations?.[0].orgId;
    if (orgId) return <Navigate params={{ org: orgId }} replace to={"/$org/dashboard"} />;
    if (!orgId) return <Navigate replace to="/" />;
  }

  // If no active organization or organization doesn't match, we need to handle this case
  if (!session?.organizations?.[0]) {
    // This could happen if user doesn't belong to any organization
    // or if there's an issue with organization loading
    return <Navigate replace to="/unauthorized" />;
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4 md:p-6 xl:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}
