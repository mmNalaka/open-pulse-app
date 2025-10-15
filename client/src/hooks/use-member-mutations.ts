import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function useMemberMutations(orgId: string) {
  const queryClient = useQueryClient();

  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "member" | "admin" | "owner";
    }) => {
      await authClient.organization.updateMemberRole({
        memberId,
        role,
      });
    },
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["members", orgId] });
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", orgId] });
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });

  const updateMemberStatusMutation = useMutation({
    mutationFn: async ({
      memberId,
      status,
    }: {
      memberId: string;
      status: "active" | "inactive";
    }) => {
      await authClient.organization.updateMemberRole({
        memberId,
        role: status,
      });
      toast.info(
        `Status toggle feature needs custom backend implementation (would set to ${status})`
      );
      // await customAPI.updateMemberStatus(memberId, status);
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  return {
    updateMemberRole: updateMemberRoleMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    updateMemberStatus: updateMemberStatusMutation.mutate,
    isUpdatingRole: updateMemberRoleMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
    isUpdatingStatus: updateMemberStatusMutation.isPending,
  };
}
