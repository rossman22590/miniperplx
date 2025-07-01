import * as React from "react"

const MOBILE_BREAKPOINT = 640 // Align with Tailwind's sm breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check for touch capability as well
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT || isTouch)
    }
    
    // Use newer event listener pattern
    try {
      // Modern browsers
      mql.addEventListener("change", onChange)
    } catch (e1) {
      try {
        // Older browsers
        mql.addListener(onChange)
      } catch (e2) {
        console.warn("Could not add media query listener")
      }
    }
    
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT || isTouch)
    
    return () => {
      try {
        mql.removeEventListener("change", onChange)
      } catch (e1) {
        try {
          mql.removeListener(onChange)
        } catch (e2) {
          console.warn("Could not remove media query listener")
        }
      }
    }
  }, [])

  return !!isMobile
}
