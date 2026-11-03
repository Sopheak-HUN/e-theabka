<script setup lang="ts">
interface TableCard {
  variant: 'cover' | 'spread'
  x: number // horizontal centre, % of hero
  y: number // vertical centre, % of hero
  size: number // relative to the base table-card width
  rot: number // degrees
  depth: number // parallax strength
  blur: number // depth-of-field blur, px
  delay: number // entrance delay, s
  hide?: 'tablet' | 'mobile'
}

const tableCards: TableCard[] = [
  { variant: 'spread', x: 24, y: 12, size: 1.9, rot: -9, depth: 1.2, blur: 3, delay: 0.1 },
  { variant: 'spread', x: 80, y: 10, size: 1.8, rot: 11, depth: 1, blur: 3.5, delay: 0.2 },
  { variant: 'cover', x: 9, y: 52, size: 1.05, rot: 14, depth: 1.6, blur: 4, delay: 0.3 },
  { variant: 'cover', x: 91, y: 56, size: 1.05, rot: -12, depth: 1.6, blur: 4, delay: 0.35 },
  { variant: 'spread', x: 20, y: 92, size: 1.9, rot: 6, depth: 2.2, blur: 5.5, delay: 0.45, hide: 'mobile' },
  { variant: 'spread', x: 82, y: 94, size: 1.8, rot: -6, depth: 2, blur: 5.5, delay: 0.5, hide: 'tablet' },
]

function cardStyle(card: TableCard) {
  return {
    '--x': `${card.x}%`,
    '--y': `${card.y}%`,
    '--size': card.size,
    '--rot': `${card.rot}deg`,
    '--depth': card.depth,
    '--blur': `${card.blur}px`,
    '--delay': `${card.delay}s`,
  }
}

// Slow parallax: pointer position and scroll are eased into CSS variables
// (--px, --py, --scroll) that the table layers read in their transforms.
const hero = ref<HTMLElement | null>(null)
let cleanup: (() => void) | undefined

onMounted(() => {
  const el = hero.value
  // Skipped on phones/touch: updating these variables restyles the whole hero each frame.
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px), (pointer: coarse)').matches) return

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const target = { x: 0, y: 0, scroll: window.scrollY }
  const current = { ...target }
  let frame = 0

  const tick = () => {
    current.x += (target.x - current.x) * 0.05
    current.y += (target.y - current.y) * 0.05
    current.scroll += (target.scroll - current.scroll) * 0.12
    el.style.setProperty('--px', current.x.toFixed(4))
    el.style.setProperty('--py', current.y.toFixed(4))
    el.style.setProperty('--scroll', current.scroll.toFixed(1))

    const settled =
      Math.abs(target.x - current.x) < 0.001 &&
      Math.abs(target.y - current.y) < 0.001 &&
      Math.abs(target.scroll - current.scroll) < 0.1
    frame = settled ? 0 : requestAnimationFrame(tick)
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick)
  }

  const onPointerMove = (event: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    schedule()
  }

  const onPointerLeave = () => {
    target.x = 0
    target.y = 0
    schedule()
  }

  const onScroll = () => {
    target.scroll = Math.min(window.scrollY, window.innerHeight)
    schedule()
  }

  if (finePointer) {
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  cleanup = () => {
    cancelAnimationFrame(frame)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('scroll', onScroll)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <section ref="hero" class="wedding-hero" aria-label="Wedding invitation">
    <GoldDefs />

    <div class="wedding-hero__table" aria-hidden="true" />
    <div class="wedding-hero__light" aria-hidden="true" />

    <div class="wedding-hero__scene" aria-hidden="true">
      <div
        v-for="(card, i) in tableCards"
        :key="i"
        class="wedding-hero__card"
        :class="card.hide && `wedding-hero__card--hide-${card.hide}`"
        :style="cardStyle(card)"
      >
        <BackdropCard :variant="card.variant" />
      </div>
    </div>

    <div class="wedding-hero__overlay" aria-hidden="true" />

    <InvitationCard class="wedding-hero__invitation" />
  </section>
</template>

<style scoped>
.wedding-hero {
  --px: 0;
  --py: 0;
  --scroll: 0;

  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  min-height: 100vh;
  min-height: 100svh;
  padding: var(--space-xl) var(--space-m);
  overflow: hidden;
  overflow: clip;
  background: var(--beige);
}

/* Bright studio table with a fine linen cloth */
.wedding-hero__table {
  position: absolute;
  inset: -8%;
  z-index: -4;
  background:
    radial-gradient(55% 45% at 36% 28%, rgba(255, 255, 250, 0.9), transparent 72%),
    radial-gradient(120% 95% at 50% 42%, #F6F1E7 0%, #E6DDCC 55%, #CFC3AE 100%);
  transform: translate3d(
    calc(var(--px) * -6px),
    calc(var(--py) * -6px + var(--scroll) * 0.25px),
    0
  );
  animation: table-in 2.4s ease-out both;
}

/* Kbach phka chan woven into the cloth, fading out towards the bottom so it meets the
   sections' own pattern without a seam */
.wedding-hero__table::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--tex-kbach) center top / 180px;
  opacity: 0.26;
  -webkit-mask: linear-gradient(#000 70%, transparent 96%);
  mask: linear-gradient(#000 70%, transparent 96%);
}

.wedding-hero__table::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--tex-linen);
  mix-blend-mode: multiply;
  opacity: 0.12;
}

/* Soft window light falling across the table */
.wedding-hero__light {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    linear-gradient(118deg,
      transparent 18%,
      rgba(255, 250, 236, 0.5) 30%,
      rgba(255, 250, 236, 0.15) 42%,
      transparent 52%,
      rgba(255, 250, 236, 0.35) 62%,
      transparent 74%);
  mix-blend-mode: soft-light;
  pointer-events: none;
  animation: table-in 3s ease-out 0.4s both;
}

.wedding-hero__scene {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.wedding-hero__card {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: calc(var(--size) * clamp(130px, 19vw, 310px));
  filter: blur(var(--blur));
  transform:
    translate(-50%, -50%)
    translate3d(
      calc(var(--px) * var(--depth) * -16px),
      calc(var(--py) * var(--depth) * -12px + var(--scroll) * var(--depth) * 0.12px),
      0
    );
  will-change: transform;
}

/* Soft cream haze keeps the hero card in focus */
.wedding-hero__overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse 45% 60% at 50% 50%, rgba(248, 243, 232, 0.55), rgba(248, 243, 232, 0.15) 70%, rgba(120, 108, 84, 0.18) 100%);
  pointer-events: none;
}

@keyframes table-in {
  from {
    opacity: 0;
    scale: 1.04;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

/* ---------- Responsive ---------- */
@media (max-width: 1024px) {
  .wedding-hero__card--hide-tablet {
    display: none;
  }
}

@media (max-width: 767px) {
  .wedding-hero {
    padding: var(--space-l) 0.25rem;
  }

  .wedding-hero__table::after {
    display: none;
  }

  .wedding-hero__table::before {
    background-size: 140px;
    opacity: 0.2;
  }

  .wedding-hero__light {
    mix-blend-mode: normal;
    opacity: 0.35;
  }

  .wedding-hero__card--hide-mobile {
    display: none;
  }

  .wedding-hero__card {
    width: calc(var(--size) * 150px);
    filter: blur(calc(var(--blur) + 1.5px));
    will-change: auto;
  }

  @keyframes table-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
