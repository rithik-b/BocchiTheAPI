"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { VariantProps, cva } from "class-variance-authority"
import cn from "@boccher/utils/cn"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors data-[state=on]:bg-pink-400 dark:hover:bg-slate-800 dark:data-[state=on]:bg-slate-800 focus:outline-none dark:text-slate-100 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-slate-900 hover:bg-pink-300  dark:hover:text-slate-100 dark:data-[state=on]:text-slate-100",
  {
    variants: {
      variant: {
        default: "bg-pink-200 dark:bg-slate-600",
        outline:
          "bg-transparent border border-pink-200 hover:bg-slate-100 dark:border-slate-700",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
