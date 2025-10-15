import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Features", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
];

export function HeroSection() {
  const [menuState, setMenuState] = useState(false);
  return (
    <>
      <header>
        <nav
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
          data-state={menuState && "active"}
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link aria-label="home" className="flex items-center space-x-2" to="/">
                  <Logo />
                </Link>

                <Button
                  aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                  className="-m-2.5 -mr-4 relative z-20 block cursor-pointer p-2.5 lg:hidden"
                  onClick={() => setMenuState(!menuState)}
                >
                  <Menu className="m-auto size-6 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 duration-200" />
                  <X className="-rotate-180 absolute inset-0 m-auto size-6 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 scale-0 in-data-[state=active]:opacity-100 opacity-0 duration-200" />
                </Button>
              </div>

              <div className="mb-6 in-data-[state=active]:block hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:in-data-[state=active]:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {menuItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                          to={item.href}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/login">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/register">
                      <span>Register</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
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
                  src="/dark-card.webp"
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
      </main>
    </>
  );
}
