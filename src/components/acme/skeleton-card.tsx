import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SkeletonCard({ className, ...props }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-4 animate-pulse",
        className
      )}
      {...props}
    >
      {/* Image Skeleton */}
      <div className="relative h-64 mb-4 rounded-lg bg-muted"></div>

      {/* Content Skeleton */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-5 bg-muted rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3.5 bg-muted rounded w-full"></div>
          <div className="h-3.5 bg-muted rounded w-5/6"></div>
        </div>
        <div className="h-10 bg-muted rounded-lg w-full"></div>
      </div>
    </div>
  )
}
