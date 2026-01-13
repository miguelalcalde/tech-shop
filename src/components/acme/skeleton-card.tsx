import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SkeletonCard({ className, ...props }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-white border-4 border-black p-4 animate-pulse",
        className
      )}
      {...props}
    >
      {/* Image Skeleton */}
      <div className="relative h-64 mb-4 border-4 border-black bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-8 bg-gray-200 w-3/4"></div>
          <div className="h-8 bg-gray-200 w-20"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 w-full"></div>
          <div className="h-4 bg-gray-200 w-5/6"></div>
        </div>
        <div className="h-12 bg-gray-200 w-full"></div>
      </div>
    </div>
  )
}
