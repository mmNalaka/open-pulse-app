import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationsTab } from "@/components/users/invitations-tab";
import { InviteMemberDialog } from "@/components/users/invite-member-dialog";
import { MembersTab } from "@/components/users/members-tab";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/$org/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const { org } = Route.useParams();
  const { data: session } = authClient.useSession();
  const {
    data: organization,
    isPending: orgLoading,
    error: orgError,
  } = authClient.useActiveOrganization();

  // Get current user's role for permissions
  // For now, let's show the button to all authenticated users for testing
  // TODO: Implement proper role-based permissions once we understand the session structure
  const canManageMembers = !!session?.user;

  // Handle loading and error states
  if (orgLoading) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Loading organization...</p>
      </div>
    );
  }

  if (orgError) {
    return (
      <div className="p-4">
        <p className="text-destructive">Error loading organization: {orgError.message}</p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">
          Organization "{org}" not found or you don't have access to it.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Users</h1>
          <p className="text-muted-foreground">
            Manage members and invitations for {organization.name}
          </p>
        </div>
        {canManageMembers && <InviteMemberDialog canManageMembers={canManageMembers} />}
      </div>

      <Tabs className="w-full" defaultValue="members">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-4" value="members">
          <MembersTab organization={organization} />
        </TabsContent>
        <TabsContent className="space-y-4" value="invitations">
          <InvitationsTab organization={organization} />
        </TabsContent>
      </Tabs>
    </>
  );
}
