import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Invitation } from "better-auth/plugins/organization";
import { Mail, MoreVertical, RefreshCw, Trash } from "lucide-react";
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

type InvitationsTableProps = {
  invitations: Invitation[];
  currentUserRole?: string;
  organizationId: string;
};

export function InvitationsTable({
  invitations,
  currentUserRole,
  organizationId,
}: InvitationsTableProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [invitationToRevoke, setInvitationToRevoke] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const canManageInvitations = currentUserRole === "owner" || currentUserRole === "admin";

  // Mutation to revoke an invitation and invalidate the invitations query
  const revokeInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      await authClient.organization.cancelInvitation({ invitationId });
    },
    onSuccess: () => {
      // Invalidate the invitations list for this organization
      queryClient.invalidateQueries({ queryKey: ["invitations", organizationId] });
    },
    onError: () => {
      toast.error("Failed to revoke invitation");
    },
  });

  const handleResendInvitation = (invitationId: string) => {
    setLoadingActions((prev) => ({ ...prev, [invitationId]: true }));
    try {
      // Note: Better Auth might not have a direct resend method
      // This would typically require a custom endpoint
      toast.info("Resend invitation feature needs custom backend implementation");
      // await customAPI.resendInvitation(invitationId);
      // toast.success(`Invitation resent to ${email}`);
    } catch (_) {
      toast.error("Failed to resend invitation");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [invitationId]: false }));
    }
  };

  const handleConfirmRevoke = async () => {
    if (!invitationToRevoke) return;

    setLoadingActions((prev) => ({ ...prev, [invitationToRevoke.id]: true }));
    try {
      await revokeInvitationMutation.mutateAsync(invitationToRevoke.id);
      toast.success(`Invitation for ${invitationToRevoke.email} has been revoked`);
      setRevokeDialogOpen(false);
      setInvitationToRevoke(null);
    } catch (_) {
      toast.error("Failed to revoke invitation");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [invitationToRevoke.id]: false }));
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "accepted":
        return "default";
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  const isExpired = (expiresAt: Date) => new Date() > new Date(expiresAt);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            {canManageInvitations && <TableHead className="w-[70px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const expired = isExpired(invitation.expiresAt);
            const actualStatus = expired ? "expired" : invitation.status;

            return (
              <TableRow key={invitation.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{invitation.email}</div>
                      <div className="text-muted-foreground text-sm">{invitation.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="capitalize" variant={getRoleBadgeVariant(invitation.role)}>
                    {invitation.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="capitalize" variant={getStatusBadgeVariant(actualStatus)}>
                    {actualStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(invitation.expiresAt).toLocaleDateString()}
                </TableCell>
                {canManageInvitations && (
                  <TableCell>
                    {actualStatus === "pending" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="h-8 w-8 p-0"
                            disabled={loadingActions[invitation.id]}
                            size="sm"
                            variant="ghost"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Resend Invitation
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <AlertDialog onOpenChange={setRevokeDialogOpen} open={revokeDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Revoke Invitation
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to revoke the invitation for{" "}
                                  {invitationToRevoke?.email}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={loadingActions[invitationToRevoke?.id || ""]}
                                  onClick={handleConfirmRevoke}
                                >
                                  {loadingActions[invitationToRevoke?.id || ""]
                                    ? "Revoking..."
                                    : "Revoke"}
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
