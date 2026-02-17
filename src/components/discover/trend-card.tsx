import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface TrendCardProps {
  number: string
  title: string
  description: string
  href: string
}

export function TrendCard({ number, title, description, href }: TrendCardProps) {
  return (
    <Link href={href} className="group block">
      <div
        className="bg-card border-4 border-foreground p-6 h-full transition-all duration-200
                    group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]
                    group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <span className="font-black text-5xl text-yellow-400 leading-none block mb-4">
          {number}
        </span>
        <h3 className="font-black text-lg uppercase tracking-tight mb-2">
          {title}
        </h3>
        <p className="font-mono text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <div className="flex items-center gap-2 font-bold text-sm uppercase group-hover:gap-3 transition-all duration-200">
          <span>Explore</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  )
}
