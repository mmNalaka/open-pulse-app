import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

type InviteMemberDialogProps = {
  canManageMembers: boolean;
  onInviteSuccess?: () => void;
};

export function InviteMemberDialog({ canManageMembers, onInviteSuccess }: InviteMemberDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const queryClient = useQueryClient();

  // Mutation to invite a member; on success, invalidate invitations and reset form
  type InviteResult = { error?: { message?: string } } | undefined;
  const inviteMemberMutation = useMutation<
    InviteResult,
    unknown,
    { email: string; role: "admin" | "member" }
  >({
    mutationFn: (payload) => authClient.organization.inviteMember(payload) as Promise<InviteResult>,
    onSuccess: (result) => {
      if (result?.error) {
        // In case the SDK returns an error in result
        toast.error(result.error.message || "Failed to send invitation");
        return;
      }
      toast.success("Invitation sent successfully!");
      setIsOpen(false);
      setEmail("");
      setRole("member");
      onInviteSuccess?.();
      // Invalidate invitations list queries (prefix match)
      queryClient.invalidateQueries({ queryKey: ["invitations"], exact: false });
    },
    onError: () => {
      toast.error("Failed to send invitation");
    },
  });

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    await inviteMemberMutation.mutateAsync({ email, role });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setEmail("");
      setRole("member");
    }
  };

  if (!canManageMembers) {
    return null;
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization. The invite link will be logged to the
            server console.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value: "admin" | "member") => setRole(value)} value={role}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button disabled={inviteMemberMutation.isPending} onClick={handleInvite}>
            {inviteMemberMutation.isPending ? "Sending..." : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
