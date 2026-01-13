"use client"

import * as React from "react"
import { LucideProps } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Button as UIButton,
  ButtonProps,
  buttonVariants,
} from "@/components/ui/button"

export interface SimpleButtonProps extends ButtonProps {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  > | null
}

const Button = React.forwardRef<HTMLButtonElement, SimpleButtonProps>(
  ({ icon: Icon, className, children, ...props }, ref) => {
    return (
      <UIButton
        className={cn("flex items-center gap-2 bg-blue-600", className)}
        ref={ref}
        {...props}
      >
        {Icon && <Icon className="h-5 w-5" />}
        {children}
      </UIButton>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }
