import { cn } from "@rithik/bocchi-the-website/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { type HTMLMotionProps, motion } from "framer-motion"
import { forwardRef } from "react"

const attemptVariants = cva(
  "flex size-8 items-center justify-center rounded-md p-1 text-white text-sm transition-colors",
  {
    variants: {
      status: {
        correct: "bg-green-600",
        incorrect: "bg-red-600",
        placeholder: "bg-pink-300 dark:bg-slate-600 text-black dark:text-white",
      },
      variant: {
        default: "",
        input: "h-full max-h-16 min-h-8 w-full sm:h-8",
      },
    },
    defaultVariants: {
      status: "placeholder",
      variant: "default",
    },
  },
)

type Props = HTMLMotionProps<"div"> & {
  status?: VariantProps<typeof attemptVariants>["status"]
  variant?: VariantProps<typeof attemptVariants>["variant"]
}

const Attempt = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { status, variant, className, ...rest } = props

  return (
    <motion.div
      className={cn(
        attemptVariants({
          status,
          variant,
          className,
        }),
      )}
      ref={ref}
      {...rest}
    />
  )
})

Attempt.displayName = "Attempt"

export default Attempt
