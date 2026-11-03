// Smooth, weighted page scrolling (Lenis) for mouse wheels and trackpads. Phones keep their
// native touch scrolling; there Lenis only drives the card's own glides (InvitationCard).
// Off for reduced motion.
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const lenis = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? null
    : new Lenis({ autoRaf: true, lerp: 0.1 })
  return { provide: { lenis } }
})
