import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import SignInForm from "@/components/auth/sign-in-form";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    const redirect = typeof search.redirect === "string" ? search.redirect : undefined;
    return { redirect } as { redirect?: string };
  },
});

// Helper function to extract path from absolute URL
function extractPathFromUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return "";
  }
}

// Helper function to build organization-based redirect
function buildOrgRedirect(target: string | undefined, org: string): string {
  const defaultPath = `/${org}/dashboard`;

  if (!target || target.length === 0) {
    return defaultPath;
  }

  // Handle absolute URLs
  if (target.startsWith("http://") || target.startsWith("https://")) {
    const path = extractPathFromUrl(target);
    if (path.startsWith(`/${org}/`)) {
      return path;
    }
    return path.length > 0 ? `/${org}${path}` : defaultPath;
  }

  // Handle relative paths
  const normalizedTarget = target.startsWith("/") ? target : `/${target}`;
  if (normalizedTarget.startsWith(`/${org}/`)) {
    return normalizedTarget;
  }
  return `/${org}${normalizedTarget}`;
}

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();
  const { data: activeOrganization, isPending: orgPending } = authClient.useActiveOrganization();

  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const redirectTo = useMemo(() => {
    const target = search?.redirect;

    // If user has an active organization, redirect to organization-based routes
    if (activeOrganization?.slug) {
      return buildOrgRedirect(target, activeOrganization.id);
    }

    // Fallback to old behavior if no organization
    if (typeof target !== "string" || target.length === 0) {
      return "/dashboard";
    }
    if (target.startsWith("http://") || target.startsWith("https://")) {
      const path = extractPathFromUrl(target);
      return path.length > 0 ? path : "/dashboard";
    }
    return target.startsWith("/") ? target : `/${target}`;
  }, [search, activeOrganization]);

  useEffect(() => {
    if (isPending || orgPending) {
      return;
    }
    if (session) {
      navigate({ to: redirectTo, replace: true });
    }
  }, [session, isPending, orgPending, navigate, redirectTo]);

  if (isPending || orgPending || session) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <SignInForm />;
}
