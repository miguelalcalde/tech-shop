import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  title: string
  description: string
  image: string
  href: string
  productCount: number
}

export function CategoryCard({
  title,
  description,
  image,
  href,
  productCount,
}: CategoryCardProps) {
  return (
    <Link href={href} className="group block">
      <div
        className="bg-card border-4 border-foreground overflow-hidden transition-all duration-200
                    group-hover:translate-x-[-6px] group-hover:translate-y-[-6px]
                    group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="relative h-56 border-b-4 border-foreground overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
            {productCount} Products
          </p>
          <h3 className="font-black text-xl uppercase tracking-tight mb-2">
            {title}
          </h3>
          <p className="font-mono text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
