import { createFileRoute } from "@tanstack/react-router";
import { HeroMinimal } from "@/components/site/hero-minimal";
import { Pricing } from "@/components/site/pricing";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="container mx-auto">
      <HeroMinimal className="mt-16 bg-secondary-foreground py-32" />
      <Pricing />
    </div>
  );
}

export default Index;
