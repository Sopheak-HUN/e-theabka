// Smooth, weighted page scrolling (Lenis) running on GSAP's frame loop, so scrolling and
// every GSAP tween advance in the same frame. Phones keep their native touch scrolling;
// there Lenis only drives the card's own glides (InvitationCard). Off for reduced motion.
import Lenis from 'lenis'
import { gsap } from 'gsap'

export default defineNuxtPlugin(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { provide: { lenis: null as Lenis | null } }
  }

  const lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  // Long frames would otherwise make the scroll jump to catch up
  gsap.ticker.lagSmoothing(0)

  return { provide: { lenis: lenis as Lenis | null } }
})
