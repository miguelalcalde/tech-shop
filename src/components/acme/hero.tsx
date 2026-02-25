"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  onCtaClick?: () => void
}

export function Hero({
  title = "TECH SHOP",
  subtitle = "BRUTALIST DESIGN MEETS CUTTING-EDGE TECHNOLOGY",
  ctaText = "SHOP NOW",
  ctaHref,
  onCtaClick,
  className,
  ...props
}: HeroProps) {
  const CtaButton = (
    <Button
      className="bg-primary text-primary-foreground px-6 py-3 
                font-medium text-sm rounded-lg
                hover:bg-primary/90 transition-colors duration-200"
      onClick={onCtaClick}
    >
      {ctaText}
    </Button>
  )

  return (
    <div
      className={cn(
        "bg-card py-16 md:py-24 lg:py-32",
        className
      )}
      {...props}
    >
      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-6">
          <h1 className="font-semibold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-balance text-foreground">
            {title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          <div className="pt-4">
            {ctaHref ? (
              <Link href={ctaHref}>{CtaButton}</Link>
            ) : (
              CtaButton
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
