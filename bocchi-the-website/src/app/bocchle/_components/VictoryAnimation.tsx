import React, { useEffect, useState } from "react"
import { motion, useAnimation, useReducedMotion } from "framer-motion"

const VictoryAnimation = () => {
  const controls = useAnimation()
  const [animationFinished, setAnimationFinished] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const animateConfetti = async () => {
      if (!prefersReducedMotion)
        await controls.start({
          y: [0, 1000],
          transition: {
            duration: 1.5,
            ease: "linear",
          },
        })

      setAnimationFinished(true)
    }

    void animateConfetti()
  }, [controls, prefersReducedMotion])

  if (animationFinished) return null

  return (
    <div className="left-1/8 fixed top-0 z-10 h-full w-3/4">
      <div className="relative h-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            animate={controls}
            className="absolute"
            initial={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              fontSize: `${Math.random() * 2 + 1.5}rem`,
            }}
          >
            🎉
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default VictoryAnimation
