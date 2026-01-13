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
        "bg-white border-b-4 border-black sticky top-0 z-50",
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
            className="font-black text-3xl uppercase tracking-tight hover:opacity-80 transition-opacity"
          >
            {logo || logoText}
          </Link>

          {/* Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-bold uppercase text-sm hover:underline transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Content (Search, Cart, etc.) */}
          {rightContent && (
            <div className="flex items-center gap-4">{rightContent}</div>
          )}
        </div>
      </div>
    </header>
  )
}
