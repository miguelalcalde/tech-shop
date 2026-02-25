"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  logoText?: string
  logoHref?: string
  navItems?: Array<{ label: string; href: string }>
  rightContent?: React.ReactNode
  showBanner?: boolean
  bannerContent?: React.ReactNode
}

export function Header({
  logo,
  logoText = "ACME",
  logoHref = "/",
  navItems = [],
  rightContent,
  showBanner,
  bannerContent,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn(
        "bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/90",
        className,
      )}
      {...props}
    >
      {showBanner && bannerContent && bannerContent}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={logoHref}
            className="font-semibold text-xl tracking-tight text-foreground hover:text-muted-foreground transition-colors"
          >
            {logo || logoText}
          </Link>

          {/* Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Content (Search, Cart, etc.) */}
          {rightContent && (
            <div className="flex items-center gap-3">{rightContent}</div>
          )}
        </div>
      </div>
    </header>
  )
}
