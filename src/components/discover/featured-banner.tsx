import Link from "next/link"
import { Button } from "@/components/ui/button"

interface FeaturedBannerProps {
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  accent?: "yellow" | "cyan"
}

export function FeaturedBanner({
  title,
  subtitle,
  ctaText,
  ctaHref,
  accent = "yellow",
}: FeaturedBannerProps) {
  const accentBg = accent === "yellow" ? "bg-yellow-400" : "bg-cyan-400"

  return (
    <div
      className={`${accentBg} border-4 border-foreground p-8 md:p-12 transition-all duration-200
                  hover:translate-x-[-4px] hover:translate-y-[-4px]
                  hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="font-black text-3xl md:text-4xl uppercase tracking-tight mb-2 text-foreground">
            {title}
          </h3>
          <p className="font-mono text-sm md:text-base uppercase text-foreground/80">
            {subtitle}
          </p>
        </div>
        <Link href={ctaHref} className="shrink-0">
          <Button
            className="bg-foreground text-background border-4 border-foreground px-8 py-4
                      font-black text-base uppercase rounded-none
                      hover:bg-background hover:text-foreground transition-colors duration-200"
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  )
}
