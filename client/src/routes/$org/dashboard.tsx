import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/$org/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  const { org } = Route.useParams();
  const { data: session, isPending } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  console.log("activeOrganization", activeOrganization, session);

  if (isPending) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <h1 className="mb-2 font-semibold text-2xl">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome {session?.user?.name} to {activeOrganization?.name || org}
      </p>
      <div className="mt-4 rounded-lg border p-4">
        <h2 className="mb-2 font-medium text-lg">Organization Details</h2>
        <p className="text-muted-foreground text-sm">
          Organization Slug: <span className="font-mono">{org}</span>
        </p>
        {activeOrganization && (
          <>
            <p className="text-muted-foreground text-sm">
              Organization Name: {activeOrganization.name}
            </p>
            <p className="text-muted-foreground text-sm">
              Organization ID: {activeOrganization.id}
            </p>
          </>
        )}
      </div>
    </>
  );
}
