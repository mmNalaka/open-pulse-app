import { useParams } from "@tanstack/react-router";
import type { Member } from "better-auth/plugins/organization";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemberMutations } from "@/hooks/use-member-mutations";
import { MemberRow } from "./member-row";

// UIMember augments the backend Member with user info and optional status that the UI consumes
export type UIMember = Partial<Member> & {
  id: string;
  userId: string;
  role: string;
  createdAt: Date | string | number;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  status?: "active" | "inactive" | string;
};

type MembersTableProps = {
  members: UIMember[];
  currentUserRole?: string;
  currentUserId?: string;
  onMemberUpdate?: () => void;
};

export function MembersTable({
  members,
  currentUserRole,
  currentUserId,
  onMemberUpdate,
}: MembersTableProps) {
  const { org } = useParams({ from: "/$org/users" });
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);

  const canManageMembers = currentUserRole === "owner" || currentUserRole === "admin";
  const isOwner = currentUserRole === "owner";

  const {
    updateMemberRole,
    removeMember,
    updateMemberStatus,
    isUpdatingRole,
    isRemovingMember,
    isUpdatingStatus,
  } = useMemberMutations(org);

  const handleRoleChange = (memberId: string, newRole: "member" | "admin" | "owner") => {
    updateMemberRole({ memberId, role: newRole });
    onMemberUpdate?.();
  };

  const handleConfirmRemove = () => {
    if (!memberToRemove) return;

    removeMember(memberToRemove.id);
    toast.success(`${memberToRemove.name} has been removed from the organization`);
    setRemoveDialogOpen(false);
    setMemberToRemove(null);
    onMemberUpdate?.();
  };

  const handleStatusToggle = (memberId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    updateMemberStatus({ memberId, status: newStatus });
  };

  const handleRemoveMember = (memberId: string, name: string) => {
    setMemberToRemove({ id: memberId, name });
    setRemoveDialogOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            {canManageMembers && <TableHead className="w-[70px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isCurrentUser = member.userId === currentUserId;
            const isLastOwner =
              member.role === "owner" && members.filter((m) => m.role === "owner").length === 1;

            return (
              <MemberRow
                canManageMembers={canManageMembers}
                disabled={isUpdatingRole || isRemovingMember || isUpdatingStatus}
                isCurrentUser={isCurrentUser}
                isLastOwner={isLastOwner}
                isOwner={isOwner}
                key={member.id}
                member={member}
                onRemoveMember={handleRemoveMember}
                onRoleChange={handleRoleChange}
                onStatusToggle={handleStatusToggle}
              />
            );
          })}
        </TableBody>
      </Table>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog onOpenChange={setRemoveDialogOpen} open={removeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} from the organization? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isRemovingMember} onClick={handleConfirmRemove}>
              {isRemovingMember ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
