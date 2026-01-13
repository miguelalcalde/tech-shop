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
      className="bg-yellow-400 text-black border-4 border-black px-8 py-4 
                font-black text-xl uppercase rounded-none
                hover:bg-black hover:text-yellow-400 hover:translate-x-[-4px] hover:translate-y-[-4px]
                hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
      onClick={onCtaClick}
    >
      {ctaText}
    </Button>
  )

  return (
    <div
      className={cn(
        "bg-white border-4 border-black p-12 md:p-16 lg:p-20",
        className
      )}
      {...props}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="font-black text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-none">
              {title}
            </h1>
            <p className="font-mono text-lg md:text-xl uppercase tracking-wide">
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

          {/* Geometric Shapes */}
          <div className="relative h-64 md:h-96">
            <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 border-4 border-black"></div>
            <div className="absolute top-8 left-8 w-32 h-32 bg-cyan-400 border-4 border-black"></div>
            <div className="absolute top-16 left-16 w-32 h-32 bg-black border-4 border-black"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-400 border-4 border-black rotate-45"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 bg-cyan-400 border-4 border-black rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
