import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

export default function AnimatedSection({ children, animationIn, animationOut, className = "" }) {
  const ref = useRef()
  const controls = useAnimation()
  const inView = useInView(ref, { threshold: 0.5 }) // Activar al 50% visible

  useEffect(() => {
    if (inView) {
      controls.start(animationIn)
    } else {
      controls.start(animationOut)
    }
  }, [inView, animationIn, animationOut, controls])

  return (
    <motion.section
  ref={ref}
  className={`section min-h-screen flex items-center justify-center ${className}`}
  initial={animationOut}
  animate={controls}
  transition={{ duration: 1, ease: "easeOut" }}
>
  {children}
</motion.section>

  )
}
