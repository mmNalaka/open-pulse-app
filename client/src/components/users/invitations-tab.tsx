import { useQuery } from '@tanstack/react-query';
import type { Invitation, Organization } from 'better-auth/plugins/organization';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { InvitationsTable } from './invitations-table';
import { TableSkeleton } from './table-skeleton';

type InvitationsTabProps = {
  organization: Organization;
};

export function InvitationsTab({ organization }: InvitationsTabProps) {
  const { data: activeMember } = authClient.useActiveMember();

  // Current user's role and permissions
  const currentUserRole = activeMember?.role;
  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

  // Fetch invitations via react-query similar to MembersTab
  const { data: invitations, isLoading } = useQuery<Invitation[] | undefined>({
    queryKey: ['invitations', organization.id],
    queryFn: async () => {
      try {
        const res = await authClient.organization.listInvitations();
        return (res.data || []).map((inv: Invitation) => ({
          ...inv,
          expiresAt: new Date(inv.expiresAt),
        }));
      } catch {
        toast.error('Failed to load invitations');
        return [];
      }
    },
  });

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Invitations</h2>
          <div className="text-muted-foreground text-sm">
            Your role:{' '}
            <span className="font-medium capitalize">{currentUserRole || 'loading...'}</span>
          </div>
        </div>

        {isLoading && <TableSkeleton showActions={canManageMembers} />}

        {!isLoading && (invitations?.length || 0) > 0 && (
          <InvitationsTable
            currentUserRole={currentUserRole}
            invitations={invitations || []}
            organizationId={organization.id}
          />
        )}

        {!isLoading && (invitations?.length || 0) === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No pending invitations.
          </div>
        )}
      </div>
    </div>
  );
}
