import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 isolate z-2 hidden opacity-50 contain-strict lg:block"
      >
        <div className="-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="-rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-60 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      <section className="overflow-hidden bg-muted/50 dark:bg-background">
        <div className="relative mx-auto max-w-5xl px-6 pt-28 lg:pt-24">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h1 className="text-balance font-semibold text-4xl md:text-5xl lg:text-6xl">
              Modern Software testing reimagined
            </h1>
            <p className="mx-auto my-8 max-w-2xl text-muted-foreground text-xl">
              Officiis laudantium excepturi ducimus rerum dignissimos, and tempora nam vitae,
              excepturi ducimus iste provident dolores.
            </p>

            <Button asChild size="lg">
              <Link to="/">
                <span className="btn-label">Start Building</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto 2xl:max-w-7xl">
          <div className="perspective-distant pl-8 lg:pl-44">
            <div className="mask-b-from-55% mask-b-to-100% mask-r-from-75% rotate-x-20 skew-x-12 pt-6 pl-6 lg:h-176">
              <img
                alt="Tailark hero section"
                className="rounded-(--radius) border shadow-xl dark:hidden"
                height={2074}
                src="/card.png"
                width={2880}
              />
              <img
                alt="Tailark hero section"
                className="hidden rounded-(--radius) border shadow-xl dark:block"
                height={2074}
                src="https://tailark.com/_next/image?url=%2Fdark-card.webp&w=3840&q=75"
                width={2880}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-muted/50 py-16 dark:bg-background">
        <div className="m-auto max-w-5xl px-6">
          <h2 className="text-center font-medium text-lg">
            Your favorite companies are our partners.
          </h2>
          <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
            <img
              alt="Nvidia Logo"
              className="h-5 w-fit dark:invert"
              height="20"
              src="https://html.tailus.io/blocks/customers/nvidia.svg"
              width="auto"
            />
            <img
              alt="Column Logo"
              className="h-4 w-fit dark:invert"
              height="16"
              src="https://html.tailus.io/blocks/customers/column.svg"
              width="auto"
            />
            <img
              alt="GitHub Logo"
              className="h-4 w-fit dark:invert"
              height="16"
              src="https://html.tailus.io/blocks/customers/github.svg"
              width="auto"
            />
            <img
              alt="Nike Logo"
              className="h-5 w-fit dark:invert"
              height="20"
              src="https://html.tailus.io/blocks/customers/nike.svg"
              width="auto"
            />
            <img
              alt="Laravel Logo"
              className="h-4 w-fit dark:invert"
              height="16"
              src="https://html.tailus.io/blocks/customers/laravel.svg"
              width="auto"
            />
            <img
              alt="Lilly Logo"
              className="h-7 w-fit dark:invert"
              height="28"
              src="https://html.tailus.io/blocks/customers/lilly.svg"
              width="auto"
            />
            <img
              alt="Lemon Squeezy Logo"
              className="h-5 w-fit dark:invert"
              height="20"
              src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
              width="auto"
            />
            <img
              alt="OpenAI Logo"
              className="h-6 w-fit dark:invert"
              height="24"
              src="https://html.tailus.io/blocks/customers/openai.svg"
              width="auto"
            />
            <img
              alt="Tailwind CSS Logo"
              className="h-4 w-fit dark:invert"
              height="16"
              src="https://html.tailus.io/blocks/customers/tailwindcss.svg"
              width="auto"
            />
            <img
              alt="Vercel Logo"
              className="h-5 w-fit dark:invert"
              height="20"
              src="https://html.tailus.io/blocks/customers/vercel.svg"
              width="auto"
            />
            <img
              alt="Zapier Logo"
              className="h-5 w-fit dark:invert"
              height="20"
              src="https://html.tailus.io/blocks/customers/zapier.svg"
              width="auto"
            />
          </div>
        </div>
      </section>
    </>
  );
}
