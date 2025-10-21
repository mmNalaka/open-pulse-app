import { createFileRoute } from "@tanstack/react-router";
import { CreateSiteDialog } from "@/modules/sites/components/create-site-dialog";
import { DataTable as SitesTable } from "@/modules/sites/components/sites-table";
import { useListSitesQuery } from "@/modules/sites/hooks/use-list-sites-query";

export const Route = createFileRoute("/$org/sites")({
  component: RouteComponent,
});

function RouteComponent() {
  const { org } = Route.useParams();
  const { data: sitesData, isLoading, error } = useListSitesQuery();

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Loading organization...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">Error loading organization: {error.message}</p>
      </div>
    );
  }

  if (!sitesData) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">
          Organization "{org}" not found or you don't have access to it.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Sites</h1>
          <p className="text-muted-foreground">
            Manage sites under your organization, all the analytics will be grouped under each site
          </p>
        </div>
        <CreateSiteDialog canCreateSite={true} />
      </div>

      <div className="w-full">
        <SitesTable data={sitesData} />
      </div>
    </>
  );
}
