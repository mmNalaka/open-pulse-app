/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */
import { Star } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type HeroProps = {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
} & React.HTMLAttributes<HTMLDivElement>;

export const HeroMinimal = ({
  heading = "A Collection of Components Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  button = {
    text: "Discover all components",
    url: "https://www.shadcnblocks.com",
  },
  reviews = {
    count: 200,
    rating: 5.0,
    avatars: [
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
        alt: "Avatar 1",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
        alt: "Avatar 2",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
        alt: "Avatar 3",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
        alt: "Avatar 4",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
        alt: "Avatar 5",
      },
    ],
  },
  ...props
}: HeroProps) => (
  <section className="py-32" {...props}>
    <div className="container text-center">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <h1 className="font-semibold text-3xl lg:text-6xl">{heading}</h1>
        <p className="text-balance text-muted-foreground lg:text-lg">{description}</p>
      </div>
      <Button asChild className="mt-10" size="lg">
        <a href={button.url}>{button.text}</a>
      </Button>
      <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
        <span className="-space-x-4 mx-4 inline-flex items-center">
          {reviews.avatars.map((avatar, index) => (
            <Avatar className="size-14 border" key={index}>
              <AvatarImage alt={avatar.alt} src={avatar.src} />
            </Avatar>
          ))}
        </span>
        <div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Star className="size-5 fill-yellow-400 text-yellow-400" key={index} />
            ))}
            <span className="mr-1 font-semibold">{reviews.rating?.toFixed(1)}</span>
          </div>
          <p className="text-left font-medium text-muted-foreground">
            from {reviews.count}+ reviews
          </p>
        </div>
      </div>
    </div>
  </section>
);
