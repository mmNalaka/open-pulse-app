import type { Member } from "better-auth/plugins/organization";
import { MoreVertical, Shield, ShieldCheck, Trash, UserCheck, UserX } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";

// UIMember augments the backend Member with user info and optional status that the UI consumes
type UIMember = Partial<Member> & {
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
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);

  const canManageMembers = currentUserRole === "owner" || currentUserRole === "admin";
  const isOwner = currentUserRole === "owner";

  const handleRoleChange = async (memberId: string, newRole: "member" | "admin" | "owner") => {
    setLoadingActions((prev) => ({ ...prev, [memberId]: true }));
    try {
      await authClient.organization.updateMemberRole({
        memberId,
        role: newRole,
      });
      toast.success(`Role updated to ${newRole}`);
      onMemberUpdate?.();
    } catch (_) {
      toast.error("Failed to update role");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;

    setLoadingActions((prev) => ({ ...prev, [memberToRemove.id]: true }));
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: memberToRemove.id,
      });
      toast.success(`${memberToRemove.name} has been removed from the organization`);
      setRemoveDialogOpen(false);
      setMemberToRemove(null);
      onMemberUpdate?.();
    } catch (_) {
      toast.error("Failed to remove member");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [memberToRemove.id]: false }));
    }
  };

  const handleStatusToggle = (memberId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setLoadingActions((prev) => ({ ...prev, [memberId]: true }));
    try {
      // Note: This would need a custom endpoint since Better Auth doesn't have built-in status toggle
      // For now, we'll show a placeholder
      toast.info(
        `Status toggle feature needs custom backend implementation (would set to ${newStatus})`
      );
      // await customAPI.updateMemberStatus(memberId, newStatus);
      // onMemberUpdate();
    } catch (_) {
      toast.error("Failed to update status");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status?: string) =>
    status === "active" ? "default" : "destructive";

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
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage alt={member.user.name} src={member.user.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {member.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {member.user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-muted-foreground text-xs">(You)</span>
                        )}
                      </div>
                      <div className="text-muted-foreground text-sm">{member.user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="capitalize" variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="capitalize" variant={getStatusBadgeVariant(member.status)}>
                    {member.status || "active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(member.createdAt).toLocaleDateString()}
                </TableCell>
                {canManageMembers && (
                  <TableCell>
                    {!(isCurrentUser || isLastOwner) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="h-8 w-8 p-0"
                            disabled={loadingActions[member.id]}
                            size="sm"
                            variant="ghost"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {/* Role changes - only owner can promote to admin, admin can't promote to owner */}
                          {member.role === "member" && (
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, "admin")}>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Promote to Admin
                            </DropdownMenuItem>
                          )}
                          {member.role === "admin" && isOwner && (
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, "member")}>
                              <Shield className="mr-2 h-4 w-4" />
                              Demote to Member
                            </DropdownMenuItem>
                          )}

                          {/* Status toggle */}
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(member.id, member.status || "active")}
                          >
                            {member.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* Remove member */}
                          <AlertDialog onOpenChange={setRemoveDialogOpen} open={removeDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {memberToRemove?.name} from the
                                  organization? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={loadingActions[memberToRemove?.id || ""]}
                                  onClick={handleConfirmRemove}
                                >
                                  {loadingActions[memberToRemove?.id || ""]
                                    ? "Removing..."
                                    : "Remove"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
