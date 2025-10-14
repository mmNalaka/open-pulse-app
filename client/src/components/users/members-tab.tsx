import { useQuery } from '@tanstack/react-query';
import type { Organization } from 'better-auth/plugins/organization';
import { authClient } from '@/lib/auth-client';
import { MembersTable } from './members-table';
import { TableSkeleton } from './table-skeleton';

type MembersTabProps = {
  organization: Organization;
};

export function MembersTab({ organization }: MembersTabProps) {
  const { data: session } = authClient.useSession();
  const { data, isLoading } = useQuery({
    queryKey: ['members', organization.id],
    queryFn: () => authClient.organization.listMembers().then((res) => res.data),
  });

  // Get current user's role and permissions
  const currentUserMember = data?.members?.find((member) => member.userId === session?.user.id);
  const currentUserRole = currentUserMember?.role;
  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Members</h2>
          <div className="text-muted-foreground text-sm">
            Your role:{' '}
            <span className="font-medium capitalize">{currentUserRole || 'loading...'}</span>
          </div>
        </div>
        {isLoading && <TableSkeleton showActions={canManageMembers} />}

        {!(isLoading || data?.members) && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No members found.
          </div>
        )}

        {!isLoading && data?.members && data?.members.length > 0 && (
          <MembersTable
            currentUserId={session?.user.id}
            currentUserRole={currentUserRole}
            members={data?.members || []}
          />
        )}
      </div>
    </div>
  );
}
