import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/header";
import { HeroSection } from "@/components/site/hero-section";
import { Pricing } from "@/components/site/pricing";
import { Testimonials } from "@/components/site/testimonials";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="w-full">
      <Header />
      <HeroSection />
      <Testimonials />
      <Pricing />
    </div>
  );
}

export default Index;
