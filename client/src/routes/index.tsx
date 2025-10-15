import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/site/hero-section";
import { Pricing } from "@/components/site/pricing";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="w-full">
      <HeroSection />
      <Pricing />
    </div>
  );
}

export default Index;
