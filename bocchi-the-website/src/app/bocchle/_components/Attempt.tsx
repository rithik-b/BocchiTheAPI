import { type VariantProps, cva } from "class-variance-authority"
import { type HTMLProps, forwardRef } from "react"

const attemptVariants = cva(
  "flex size-8 items-center justify-center rounded-md p-1 text-white text-sm",
  {
    variants: {
      status: {
        correct: "bg-green-600",
        incorrect: "bg-red-600",
        placeholder: "bg-pink-300 dark:bg-slate-600",
      },
    },
    defaultVariants: {
      status: "placeholder",
    },
  },
)

type Props = HTMLProps<HTMLDivElement> & {
  status?: VariantProps<typeof attemptVariants>["status"]
}

const Attempt = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { status, className, ...rest } = props

  return (
    <div
      className={attemptVariants({
        status,
        className,
      })}
      ref={ref}
      {...rest}
    />
  )
})

Attempt.displayName = "Attempt"

export default Attempt
