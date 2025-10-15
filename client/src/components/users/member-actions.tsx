import { MoreVertical, Shield, ShieldCheck, Trash, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MemberActionsProps = {
  member: {
    id: string;
    role: string;
    status?: string;
    user: { name: string };
  };
  isCurrentUser: boolean;
  isLastOwner: boolean;
  isOwner: boolean;
  canManageMembers: boolean;
  onRoleChange: (memberId: string, newRole: "member" | "admin" | "owner") => void;
  onRemoveMember: (memberId: string, name: string) => void;
  onStatusToggle: (memberId: string, currentStatus: string) => void;
  disabled?: boolean;
};

export function MemberActions({
  member,
  isCurrentUser,
  isLastOwner,
  isOwner,
  canManageMembers,
  onRoleChange,
  onRemoveMember,
  onStatusToggle,
  disabled = false,
}: MemberActionsProps) {
  if (isCurrentUser || isLastOwner || !canManageMembers) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-8 w-8 p-0"
          disabled={disabled}
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
          <DropdownMenuItem onClick={() => onRoleChange(member.id, "admin")}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Promote to Admin
          </DropdownMenuItem>
        )}
        {member.role === "admin" && isOwner && (
          <DropdownMenuItem onClick={() => onRoleChange(member.id, "member")}>
            <Shield className="mr-2 h-4 w-4" />
            Demote to Member
          </DropdownMenuItem>
        )}
        {member.role === "admin" && !isOwner && (
          <DropdownMenuItem disabled>
            <Shield className="mr-2 h-4 w-4" />
            Cannot demote admins
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Status toggle */}
        <DropdownMenuItem onClick={() => onStatusToggle(member.id, member.status || "active")}>
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

        {/* Remove member - only for non-owners */}
        {member.role !== "owner" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onRemoveMember(member.id, member.user.name)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Remove Member
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
