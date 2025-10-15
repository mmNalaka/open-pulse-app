import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type TestimonialsProps = React.HTMLAttributes<HTMLDivElement>;

export function Testimonials({ ...props }: TestimonialsProps) {
  return (
    <section className="bg-stone-900 py-16 md:py-32" {...props}>
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="font-medium text-4xl lg:text-5xl">
            Build by makers, loved by thousand developers
          </h2>
          <p>
            Gemini is evolving to be more than just the models. It supports an entire to the APIs
            and platforms helping developers and businesses innovate.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
            <CardHeader>
              <img
                alt="Nike Logo"
                className="h-6 w-fit dark:invert"
                height="24"
                src="https://html.tailus.io/blocks/customers/nike.svg"
                width="auto"
              />
            </CardHeader>
            <CardContent>
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="font-medium text-xl">
                  Tailus has transformed the way I develop web applications. Their extensive
                  collection of UI components, blocks, and templates has significantly accelerated
                  my workflow. The flexibility to customize every aspect allows me to create unique
                  user experiences. Tailus is a game-changer for modern web development
                </p>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      alt="Shekinah Tshiokufila"
                      height="400"
                      loading="lazy"
                      src="https://tailus.io/images/reviews/shekinah.webp"
                      width="400"
                    />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>

                  <div>
                    <cite className="font-medium text-sm">Shekinah Tshiokufila</cite>
                    <span className="block text-muted-foreground text-sm">Software Ingineer</span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="font-medium text-xl">
                  Tailus is really extraordinary and very practical, no need to break your head. A
                  real gold mine.
                </p>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      alt="Jonathan Yombo"
                      height="400"
                      loading="lazy"
                      src="https://tailus.io/images/reviews/jonathan.webp"
                      width="400"
                    />
                    <AvatarFallback>JY</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="font-medium text-sm">Jonathan Yombo</cite>
                    <span className="block text-muted-foreground text-sm">Software Ingineer</span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p>
                  Great work on tailfolio template. This is one of the best personal website that I
                  have seen so far!
                </p>

                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                  <Avatar className="size-12">
                    <AvatarImage
                      alt="Yucel Faruksahan"
                      height="400"
                      loading="lazy"
                      src="https://tailus.io/images/reviews/yucel.webp"
                      width="400"
                    />
                    <AvatarFallback>YF</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="font-medium text-sm">Yucel Faruksahan</cite>
                    <span className="block text-muted-foreground text-sm">Creator, Tailkits</span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          <Card className="card variant-mixed">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p>
                  Great work on tailfolio template. This is one of the best personal website that I
                  have seen so far!
                </p>

                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      alt="Rodrigo Aguilar"
                      height="400"
                      loading="lazy"
                      src="https://tailus.io/images/reviews/rodrigo.webp"
                      width="400"
                    />
                    <AvatarFallback>YF</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Rodrigo Aguilar</p>
                    <span className="block text-muted-foreground text-sm">
                      Creator, TailwindAwesome
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
