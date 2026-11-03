<script setup lang="ts">
// One invitation panel: a sage board holding a cream insert with a rose band,
// gold foil rules and silver filigree. Page content goes in the default slot.
withDefaults(
  defineProps<{ sides?: boolean; tone?: 'silver' | 'rose' }>(),
  { sides: true, tone: 'silver' },
)

const corners = ['tl', 'tr', 'bl', 'br'] as const
</script>

<template>
  <div class="paper-board">
    <div class="paper-board__insert">
      <div class="paper-board__band" aria-hidden="true" />
      <div class="paper-board__foil paper-board__foil--outer" aria-hidden="true" />
      <div class="paper-board__foil paper-board__foil--inner" aria-hidden="true" />
      <div class="paper-board__foil paper-board__foil--hairline" aria-hidden="true" />
      <FiligreeCorner
        v-for="pos in corners"
        :key="pos"
        class="paper-board__corner"
        :class="`paper-board__corner--${pos}`"
        :tone="tone"
      />
      <template v-if="sides">
        <FiligreeSide class="paper-board__side paper-board__side--left" :tone="tone" />
        <FiligreeSide class="paper-board__side paper-board__side--right" :tone="tone" />
      </template>

      <div class="paper-board__content">
        <slot />
      </div>
    </div>

    <div class="paper-board__sheen" aria-hidden="true" />
  </div>
</template>

<style scoped>
/* ---------- Sage board ---------- */
.paper-board {
  position: relative;
  flex: 1 1 0%;
  min-width: 0;
  display: flex;
  /* 5:7 at the page width (the stage is the container), growing if the text needs more */
  min-height: 140cqi;
  padding: 3.6cqi;
  border-radius: 1cqi;
  background:
    var(--tex-paper),
    radial-gradient(130% 90% at 25% 10%, var(--sage-light), var(--sage) 45%, var(--sage-dark) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(40, 36, 24, 0.25),
    0 8px 18px rgba(40, 36, 24, 0.18),
    0 30px 60px -14px rgba(40, 36, 24, 0.45),
    0 60px 110px -30px rgba(40, 36, 24, 0.4);
}

/* ---------- Cream insert ---------- */
.paper-board__insert {
  position: relative;
  flex: 1;
  /* Content can never widen the card */
  min-width: 0;
  display: flex;
  border-radius: 0.3cqi;
  background:
    var(--tex-paper),
    radial-gradient(130% 90% at 28% 12%, #FFFCF5 0%, var(--ivory) 45%, #EFE7D7 100%);
  box-shadow:
    0 0.4cqi 0.8cqi rgba(30, 34, 24, 0.35),
    inset 0 0 5cqi rgba(168, 134, 66, 0.1);
}

/* Dusty rose band */
.paper-board__band {
  position: absolute;
  inset: 2.6cqi;
  padding: 2.4cqi;
  background:
    var(--tex-paper),
    linear-gradient(160deg, #E2B9B4, var(--rose) 50%, var(--rose-deep));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}

/* Shimmering gold foil rules on both edges of the band, plus an inner hairline */
.paper-board__foil {
  position: absolute;
  background: var(--gold-foil);
  background-size: 260% 260%;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: foil-shimmer var(--dur-shimmer) ease-in-out infinite alternate;
  pointer-events: none;
}

.paper-board__foil--outer {
  inset: 2.6cqi;
  padding: max(1.5px, 0.4cqi);
}

.paper-board__foil--inner {
  inset: 4.6cqi;
  padding: max(1.5px, 0.4cqi);
  animation-delay: -2s;
}

.paper-board__foil--hairline {
  inset: 6.2cqi;
  padding: 1px;
  animation-delay: -4s;
}

/* ---------- Filigree ---------- */
.paper-board__corner {
  position: absolute;
  width: 23cqi;
  height: 23cqi;
  pointer-events: none;
}

.paper-board__corner--tl { top: 1.4cqi; left: 1.4cqi; }
.paper-board__corner--tr { top: 1.4cqi; right: 1.4cqi; scale: -1 1; }
.paper-board__corner--bl { bottom: 1.4cqi; left: 1.4cqi; scale: 1 -1; }
.paper-board__corner--br { bottom: 1.4cqi; right: 1.4cqi; scale: -1 -1; }

.paper-board__side {
  position: absolute;
  top: 50%;
  width: 6cqi;
  translate: 0 -50%;
  opacity: 0.85;
  pointer-events: none;
}

.paper-board__side--left { left: 7.6cqi; }
.paper-board__side--right { right: 7.6cqi; scale: -1 1; }

/* ---------- Content ---------- */
.paper-board__content {
  position: relative;
  z-index: 1;
  flex: 1;
  /* Content can never widen the card */
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2cqi;
  padding: 13cqi 15cqi 11cqi;
  text-align: center;
}

/* Light sheen that follows the pointer (--gx / --gy set by the parent) */
.paper-board__sheen {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  background:
    radial-gradient(circle at var(--gx, 28%) var(--gy, 18%),
      rgba(255, 255, 255, 0.55),
      transparent 48%),
    linear-gradient(115deg, rgba(255, 248, 228, 0.2), transparent 45%, rgba(60, 60, 40, 0.06));
  mix-blend-mode: soft-light;
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 0.8s var(--ease-silk);
}

.paper-board:hover .paper-board__sheen {
  opacity: 1;
}

@keyframes foil-shimmer {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}

/* Phones and touch screens: keep the foil still to save repaints */
@media (max-width: 767px), (pointer: coarse) {
  .paper-board__foil {
    animation: none;
  }
}

@media (max-width: 640px) {
  .paper-board__content {
    padding: 13cqi 12cqi 11cqi;
  }

  .paper-board__side {
    display: none;
  }
}

@media (max-width: 767px) {
  .paper-board {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.25),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(40, 36, 24, 0.25),
      0 16px 36px -10px rgba(40, 36, 24, 0.35);
  }

  .paper-board__insert {
    box-shadow: 0 0.4cqi 0.8cqi rgba(30, 34, 24, 0.35);
  }

  .paper-board__sheen {
    display: none;
  }
}
</style>
