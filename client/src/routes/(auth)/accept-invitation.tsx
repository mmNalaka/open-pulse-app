import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { Invitation } from "better-auth/plugins/organization";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import SignUpForm from "@/components/auth/sign-up-form";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/(auth)/accept-invitation")({
  validateSearch: z.object({
    token: z.string().min(1, "Invitation token is required").catch(""),
    redirect: z.string().optional().catch(undefined),
    orgName: z.string().optional().catch(undefined),
    inviterName: z.string().optional().catch(undefined),
  }),
  component: RouteComponent,
});

const COUNTDOWN_SECONDS = 3;
const TICK_MS = 1000;

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, redirect, orgName, inviterName } = Route.useSearch();
  const { data: session } = authClient.useSession();
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Once authenticated, fetch the invitation to validate status and show org info
  const {
    data: invitationRes,
    isPending: inviteLoading,
    error: inviteError,
  } = useQuery<Invitation | undefined>({
    queryKey: ["invitation", token],
    queryFn: async () => {
      const res = await authClient.organization.getInvitation({ query: { id: token } });
      return res.data as Invitation | undefined;
    },
    enabled: Boolean(token && session),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (t: string) => {
      // Better Auth expects invitationId
      return await authClient.organization.acceptInvitation({ invitationId: t });
    },
    onSuccess: async () => {
      // Invalidate likely-affected caches to refresh UI
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["invitations"] }),
        queryClient.invalidateQueries({ queryKey: ["members"] }),
        queryClient.invalidateQueries({ queryKey: ["session"] }),
        queryClient.invalidateQueries({ queryKey: ["active-organization"] }),
        queryClient.invalidateQueries({ queryKey: ["active-member"] }),
      ]);

      toast.success("Invitation accepted. Welcome to the organization!");
      const to = redirect || "/dashboard";
      // Start a short countdown before redirecting
      setRedirectCountdown(COUNTDOWN_SECONDS);
      timerRef.current = window.setInterval(() => {
        setRedirectCountdown((prev) => {
          const next = (prev ?? 1) - 1;
          if (next <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            navigate({ to, replace: true });
          }
          return next;
        });
      }, TICK_MS);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to accept invitation";
      toast.error(message);
    },
  });

  useEffect(() => {
    if (!(token && session && invitationRes)) {
      return;
    }
    const expiresAt = invitationRes.expiresAt ? new Date(invitationRes.expiresAt) : null;
    const isExpired = expiresAt ? new Date() > expiresAt : false;
    const isPendingStatus = invitationRes.status === "pending";
    if (!isExpired && isPendingStatus) {
      mutate(token);
    }
  }, [token, session, invitationRes, mutate]);

  // Cleanup any running timer on unmount
  useEffect(
    () => () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    },
    []
  );

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="space-y-3 text-center">
        {!token && (
          <>
            <h1 className="font-semibold text-xl">Invalid invitation link</h1>
            <p className="text-muted-foreground">The invitation token is missing.</p>
          </>
        )}

        {token && !session && (
          <>
            <h1 className="font-semibold text-xl">
              You are invited to join {orgName} by {inviterName}
              Create your account to accept the invitation
            </h1>
            <p className="text-muted-foreground">Sign up below to continue.</p>
            <div className="pt-4">
              <SignUpForm
                disableNavigate
                onSuccess={() => {
                  // After successful signup, the session hook will update and the effect above
                  // will validate and accept the invitation automatically.
                  toast.success("Account created. Finalizing your invitation…");
                }}
                onSwitchToSignIn={() => {
                  // If you later want to support inline sign-in, we could toggle to a SignInForm here.
                  // For now, keep only SignUp per requirements.
                }}
              />
            </div>
          </>
        )}

        {token && session && (
          <>
            {inviteLoading && (
              <div>
                <h1 className="font-semibold text-xl">Checking invitation…</h1>
                <p className="text-muted-foreground">
                  Please wait while we validate your invitation.
                </p>
              </div>
            )}
            {!inviteLoading && (inviteError || !invitationRes) && (
              <div>
                <h1 className="font-semibold text-xl">Invalid invitation</h1>
                <p className="text-muted-foreground">
                  We couldn't find this invitation. It may be invalid.
                </p>
              </div>
            )}
            {!inviteLoading &&
              invitationRes &&
              (() => {
                const expiresAt = invitationRes.expiresAt
                  ? new Date(invitationRes.expiresAt)
                  : null;
                const isExpired = expiresAt ? new Date() > expiresAt : false;
                const isPendingStatus = invitationRes.status === "pending";

                if (isExpired) {
                  return (
                    <div>
                      <h1 className="font-semibold text-xl">Invitation expired</h1>
                      <p className="text-muted-foreground">
                        This invitation to join {orgName} has expired.
                      </p>
                    </div>
                  );
                }

                if (!isPendingStatus) {
                  return (
                    <div>
                      <h1 className="font-semibold text-xl">Invitation already used</h1>
                      <p className="text-muted-foreground">
                        You've already responded to this invitation for {orgName}.
                      </p>
                    </div>
                  );
                }

                // Pending and valid: show the accepting/countdown states
                return redirectCountdown === null ? (
                  <div>
                    <h1 className="font-semibold text-xl">Accepting invitation…</h1>
                    <p className="text-muted-foreground">
                      {isPending ? "Please wait while we process your invitation." : "Finalizing…"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="font-semibold text-xl">Invitation accepted</h1>
                    <p className="text-muted-foreground">Redirecting in {redirectCountdown}s…</p>
                  </div>
                );
              })()}
          </>
        )}
      </div>
    </div>
  );
}
