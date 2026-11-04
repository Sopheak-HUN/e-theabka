<script setup lang="ts">
interface TableCard {
  variant: 'cover' | 'spread'
  x: number // horizontal centre, % of hero
  y: number // vertical centre, % of hero
  size: number // relative to the base table-card width
  rot: number // degrees
  blur: number // depth-of-field blur, px
  delay: number // entrance delay, s
  hide?: 'tablet' | 'mobile'
}

const tableCards: TableCard[] = [
  { variant: 'spread', x: 24, y: 12, size: 1.9, rot: -9, blur: 3, delay: 0.1 },
  { variant: 'spread', x: 80, y: 10, size: 1.8, rot: 11, blur: 3.5, delay: 0.2 },
  { variant: 'cover', x: 9, y: 52, size: 1.05, rot: 14, blur: 4, delay: 0.3 },
  { variant: 'cover', x: 91, y: 56, size: 1.05, rot: -12, blur: 4, delay: 0.35 },
  { variant: 'spread', x: 20, y: 92, size: 1.9, rot: 6, blur: 5.5, delay: 0.45, hide: 'mobile' },
  { variant: 'spread', x: 82, y: 94, size: 1.8, rot: -6, blur: 5.5, delay: 0.5, hide: 'tablet' },
]

function cardStyle(card: TableCard) {
  return {
    '--x': `${card.x}%`,
    '--y': `${card.y}%`,
    '--size': card.size,
    '--rot': `${card.rot}deg`,
    '--blur': `${card.blur}px`,
    '--delay': `${card.delay}s`,
  }
}
</script>

<template>
  <section class="wedding-hero" aria-label="Wedding invitation">
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

/* One static layer for all the blurred cards: the blur is painted once, not on every repaint */
.wedding-hero__scene {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  contain: strict;
  will-change: transform;
}

.wedding-hero__card {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: calc(var(--size) * clamp(130px, 19vw, 310px));
  filter: blur(var(--blur));
  transform: translate(-50%, -50%);
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
