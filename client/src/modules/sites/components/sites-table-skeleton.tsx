import type { Invitation } from "better-auth/plugins/organization";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SitesTableProps = {
  sites: Invitation[];
  currentUserRole?: string;
};

export function SitesTable({ sites, currentUserRole }: SitesTableProps) {
  const canManageSites = currentUserRole === "owner" || currentUserRole === "admin";
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
            <TableHead>Member</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            {canManageSites && <TableHead className="w-[70px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((invitation) => {
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
                  <a
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    href={`mailto:${invitation.email}`}
                  >
                    {invitation.email}
                  </a>
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
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(invitation.expiresAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                {canManageSites && (
                  <TableCell>
                    <button className="text-muted-foreground hover:text-foreground" type="button">
                      ⋯
                    </button>
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
