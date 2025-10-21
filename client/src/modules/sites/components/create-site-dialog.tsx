import { useParams } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
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
import { useCreateSiteMutation } from "../hooks/use-create-site-mutation";
import { CreateSiteForm } from "./create-site-form";

type CreateSiteDialogProps = {
  canCreateSite: boolean;
  onSiteCreateSuccess?: () => void;
};

export function CreateSiteDialog({ canCreateSite, onSiteCreateSuccess }: CreateSiteDialogProps) {
  const { org } = useParams({ from: "/$org/sites" });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const createSiteMutation = useCreateSiteMutation();

  const handleCreateSite = (data: { name: string; domain: string; metadata: string }) => {
    try {
      setIsLoading(true);
      createSiteMutation.mutate({
        ...data,
        organizationId: org,
      });
      setIsOpen(false);
      onSiteCreateSuccess?.();
    } catch (error) {
      console.error("Failed to create site:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  if (!canCreateSite) {
    return null;
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
          <DialogDescription>
            Add a new site to your organization. All analytics will be associated with this site.
          </DialogDescription>
        </DialogHeader>
        <CreateSiteForm isLoading={isLoading} onSubmit={handleCreateSite} />
        <DialogFooter>
          <Button disabled={isLoading} onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button disabled={isLoading} form="create-site-form" type="submit">
            {isLoading ? "Creating..." : "Create Site"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
