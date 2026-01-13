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
        "text-white bg-black border-t-4 border-yellow-400",
        className
      )}
      {...props}
    >
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="inline-block pb-2 mb-4 text-lg font-black uppercase border-b-2 border-yellow-400">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link: FooterLink, index: number) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="font-mono text-sm uppercase transition-colors hover:text-yellow-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 text-center border-t-4 border-yellow-400">
          <p className="text-sm font-black uppercase">{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
