"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  sections?: FooterSection[]
  copyrightText?: string
  className?: string
}

const defaultSections: FooterSection[] = [
  {
    title: "QUICK LINKS",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "CUSTOMER SERVICE",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Warranty", href: "/warranty" },
    ],
  },
  {
    title: "CONNECT",
    links: [
      { label: "Twitter", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
    ],
  },
]

export function Footer({
  sections = defaultSections,
  copyrightText = "© 2024 TECH SHOP. ALL RIGHTS RESERVED.",
  className,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(
        "bg-primary text-primary-foreground border-t border-border",
        className
      )}
      {...props}
    >
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium mb-4 text-primary-foreground/70 tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link: FooterLink, index: number) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 text-center border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/50">{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
