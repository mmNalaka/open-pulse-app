import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { MemberActions } from "./member-actions";
import type { UIMember } from "./members-table";

type MemberRowProps = {
  member: UIMember;
  isCurrentUser: boolean;
  isLastOwner: boolean;
  isOwner: boolean;
  canManageMembers: boolean;
  onRoleChange: (memberId: string, newRole: "member" | "admin" | "owner") => void;
  onRemoveMember: (memberId: string, name: string) => void;
  onStatusToggle: (memberId: string, currentStatus: string) => void;
  disabled?: boolean;
};

export function MemberRow({
  member,
  isCurrentUser,
  isLastOwner,
  isOwner,
  canManageMembers,
  onRoleChange,
  onRemoveMember,
  onStatusToggle,
  disabled = false,
}: MemberRowProps) {
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
    <TableRow>
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
          <MemberActions
            member={member}
            isCurrentUser={isCurrentUser}
            isLastOwner={isLastOwner}
            isOwner={isOwner}
            canManageMembers={canManageMembers}
            onRoleChange={onRoleChange}
            onRemoveMember={onRemoveMember}
            onStatusToggle={onStatusToggle}
            disabled={disabled}
          />
        </TableCell>
      )}
    </TableRow>
  );
}
