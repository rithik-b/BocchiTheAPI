import { motion } from "framer-motion"
import { type PropsWithChildren } from "react"

interface Props {
  open: boolean
  className?: string
}

const Collapsible = ({
  children,
  open,
  className,
}: PropsWithChildren<Props>) => {
  const animate = {
    transition: { type: "tween" },
    height: open ? "auto" : 0,
  }

  return (
    <div aria-expanded={open}>
      <motion.div
        style={{ overflow: "hidden" }}
        initial={{ height: open ? "auto" : 0 }}
        animate={animate}
        exit={{ height: 0, display: "none" }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default Collapsible
