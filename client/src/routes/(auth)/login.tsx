import { createFileRoute, Link } from "@tanstack/react-router";
import SignInForm from "@/components/auth/sign-in-form";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

export function RouteComponent() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link className="flex items-center gap-2 font-medium" to="/">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground" />
            Acme Inc.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
}
