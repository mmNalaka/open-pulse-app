import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import SignUpForm from "@/components/auth/sign-up-form";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(auth)/register")({
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
function buildOrgRedirect(target: string | undefined, orgSlug: string): string {
  const defaultPath = `/${orgSlug}/dashboard`;

  if (!target || target.length === 0) {
    return defaultPath;
  }

  // Handle absolute URLs
  if (target.startsWith("http://") || target.startsWith("https://")) {
    const path = extractPathFromUrl(target);
    if (path.startsWith(`/${orgSlug}/`)) {
      return path;
    }
    return path.length > 0 ? `/${orgSlug}${path}` : defaultPath;
  }

  // Handle relative paths
  const normalizedTarget = target.startsWith("/") ? target : `/${target}`;
  if (normalizedTarget.startsWith(`/${orgSlug}/`)) {
    return normalizedTarget;
  }
  return `/${orgSlug}${normalizedTarget}`;
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
      return buildOrgRedirect(target, activeOrganization.slug);
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

  return <SignUpForm />;
}
