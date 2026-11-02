<script setup lang="ts">
const corners = ['tl', 'tr', 'bl', 'br'] as const

// Personalise the guest box with ?to=Guest%20Name in the link.
const guest = useRequestURL().searchParams.get('to') ?? ''

const card = ref<HTMLElement | null>(null)
let canTilt = false

onMounted(() => {
  canTilt =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

// Gentle pointer-follow tilt plus a moving light sheen across the paper.
function onPointerMove(event: PointerEvent) {
  if (!canTilt || !card.value) return
  const rect = card.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  const style = card.value.style
  style.setProperty('--ry', `${((x - 0.5) * 6).toFixed(2)}deg`)
  style.setProperty('--rx', `${((0.5 - y) * 5).toFixed(2)}deg`)
  style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
  style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
}

function onPointerLeave() {
  if (!card.value) return
  for (const prop of ['--rx', '--ry', '--gx', '--gy']) {
    card.value.style.removeProperty(prop)
  }
}
</script>

<template>
  <div class="invitation-stage">
    <div class="invitation-glow" aria-hidden="true" />
    <div class="invitation-shadow" aria-hidden="true" />

    <div class="invitation-float">
      <!-- Sage board holding the cream invitation -->
      <article
        ref="card"
        class="invitation"
        aria-labelledby="invitation-title"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
      >
        <div class="invitation__paper">
          <!-- Decorative layers: rose band edged in gold foil, silver filigree -->
          <div class="invitation__band" aria-hidden="true" />
          <div class="invitation__foil invitation__foil--outer" aria-hidden="true" />
          <div class="invitation__foil invitation__foil--inner" aria-hidden="true" />
          <div class="invitation__foil invitation__foil--hairline" aria-hidden="true" />
          <FiligreeCorner
            v-for="pos in corners"
            :key="pos"
            class="invitation__corner"
            :class="`invitation__corner--${pos}`"
          />
          <FiligreeSide class="invitation__side invitation__side--left" />
          <FiligreeSide class="invitation__side invitation__side--right" />

          <div class="invitation__content">
            <h1 id="invitation-title" class="invitation__title" lang="km" style="--i: 0">
              សិរីមង្គលអាពាហ៍ពិពាហ៍
            </h1>

            <!-- Edit the couple's initials here -->
            <MonogramCartouche class="invitation__monogram" groom="ក" bride="ស" style="--i: 1" />

            <p class="invitation__couple" style="--i: 2">
              <span>[GROOM NAME]</span>
              <span class="invitation__amp">&amp;</span>
              <span>[BRIDE NAME]</span>
            </p>

            <div class="invitation__guest" style="--i: 3">
              <p class="invitation__invite" lang="km">សូមគោរពអញ្ជើញ</p>
              <p class="invitation__guest-box">
                <span v-if="guest" class="invitation__guest-name">{{ guest }}</span>
              </p>
            </div>

            <!-- Update both the datetime attributes and the visible text -->
            <div class="invitation__details" lang="km" style="--i: 4">
              <p>
                <span class="invitation__phrase">ថ្ងៃ <time class="invitation__value" datetime="2027-01-16">[WEDDING DATE]</time></span>
                <span class="invitation__phrase">វេលាម៉ោង <time class="invitation__value" datetime="17:00">[WEDDING TIME]</time></span>
              </p>
              <address>
                ប្រារព្ធនៅ <span class="invitation__value">[WEDDING VENUE]</span>
              </address>
            </div>
          </div>
        </div>

        <div class="invitation__sheen" aria-hidden="true" />
      </article>
    </div>
  </div>
</template>

<style scoped>
/* ---------- Stage: sizing, entrance, ambient light ---------- */
.invitation-stage {
  --card-w: min(31rem, 86vw, calc((100vh - 6rem) * 0.72));
  --lean-x: 5deg;
  --lean-z: -2.4deg;

  position: relative;
  width: var(--card-w);
  container-type: inline-size;
  animation: card-enter var(--dur-enter) var(--ease-silk) 0.35s both;
}

@supports (height: 100svh) {
  .invitation-stage {
    --card-w: min(31rem, 86vw, calc((100svh - 6rem) * 0.72));
  }
}

.invitation-glow {
  position: absolute;
  inset: -25% -45%;
  z-index: -1;
  background: radial-gradient(closest-side,
      rgba(255, 252, 244, 0.85),
      rgba(255, 240, 214, 0.35) 50%,
      transparent 78%);
  filter: blur(24px);
  pointer-events: none;
  animation: glow-breathe var(--dur-glow) ease-in-out infinite alternate;
}

.invitation-shadow {
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: -5%;
  height: 12%;
  z-index: -1;
  background: radial-gradient(closest-side, rgba(52, 46, 32, 0.45), transparent);
  filter: blur(16px);
  pointer-events: none;
  animation: shadow-breathe var(--dur-float) ease-in-out infinite;
}

.invitation-float {
  perspective: 1600px;
  animation: card-float var(--dur-float) ease-in-out infinite;
}

/* ---------- Sage board ---------- */
.invitation {
  --rx: 0deg;
  --ry: 0deg;
  --lift: 1;

  position: relative;
  display: flex;
  aspect-ratio: 5 / 7;
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
  transform:
    rotateX(calc(var(--lean-x) + var(--rx)))
    rotateY(var(--ry))
    rotate(var(--lean-z))
    scale(var(--lift));
  transition:
    transform 0.8s var(--ease-silk),
    box-shadow 0.8s var(--ease-silk);
}

.invitation:hover {
  --lift: 1.015;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(40, 36, 24, 0.25),
    0 12px 24px rgba(40, 36, 24, 0.2),
    0 44px 76px -16px rgba(40, 36, 24, 0.5),
    0 80px 140px -30px rgba(40, 36, 24, 0.45);
}

/* ---------- Cream insert ---------- */
.invitation__paper {
  position: relative;
  flex: 1;
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
.invitation__band {
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
.invitation__foil {
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

.invitation__foil--outer {
  inset: 2.6cqi;
  padding: max(1.5px, 0.4cqi);
}

.invitation__foil--inner {
  inset: 4.6cqi;
  padding: max(1.5px, 0.4cqi);
  animation-delay: -2s;
}

.invitation__foil--hairline {
  inset: 6.2cqi;
  padding: 1px;
  animation-delay: -4s;
}

/* ---------- Filigree ---------- */
.invitation__corner {
  position: absolute;
  width: 23cqi;
  height: 23cqi;
  pointer-events: none;
}

.invitation__corner--tl { top: 1.4cqi; left: 1.4cqi; }
.invitation__corner--tr { top: 1.4cqi; right: 1.4cqi; scale: -1 1; }
.invitation__corner--bl { bottom: 1.4cqi; left: 1.4cqi; scale: 1 -1; }
.invitation__corner--br { bottom: 1.4cqi; right: 1.4cqi; scale: -1 -1; }

.invitation__side {
  position: absolute;
  top: 50%;
  width: 6cqi;
  translate: 0 -50%;
  opacity: 0.85;
  pointer-events: none;
}

.invitation__side--left { left: 7.6cqi; }
.invitation__side--right { right: 7.6cqi; scale: -1 1; }

/* ---------- Content ---------- */
.invitation__content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2cqi;
  padding: 13cqi 15cqi 11cqi;
  text-align: center;
}

.invitation__content > * {
  animation: content-rise 1.2s var(--ease-silk) both;
  animation-delay: calc(1.1s + var(--i, 0) * 0.14s);
}

.invitation__title,
.invitation__invite {
  background: var(--gold-foil);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: var(--gold-emboss);
}

.invitation__title {
  font-family: var(--font-khmer-display);
  font-weight: 400;
  font-size: clamp(17px, 5.4cqi, 28px);
  line-height: 1.8;
  animation:
    content-rise 1.2s var(--ease-silk) 1.1s both,
    foil-shimmer var(--dur-shimmer) ease-in-out infinite alternate;
}

.invitation__monogram {
  width: 40cqi;
  filter: var(--gold-emboss) drop-shadow(0 2px 3px rgba(168, 134, 66, 0.2));
}

.invitation__couple {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  column-gap: 1.6cqi;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(11px, 2.9cqi, 15px);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold-deep);
}

.invitation__amp {
  font-style: italic;
  font-weight: 500;
  font-size: 1.5em;
  letter-spacing: 0;
}

.invitation__guest {
  display: grid;
  justify-items: center;
  gap: 1.4cqi;
  width: 100%;
}

.invitation__invite {
  font-family: var(--font-khmer-display);
  font-size: clamp(12px, 3.3cqi, 17px);
  line-height: 1.8;
}

/* Box for the guest's name, as on printed invitations */
.invitation__guest-box {
  display: grid;
  place-items: center;
  width: 82%;
  min-height: clamp(30px, 8cqi, 42px);
  border: 1px solid var(--ink);
  border-radius: 1px;
}

.invitation__guest-name {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(14px, 3.8cqi, 20px);
  color: var(--ink);
}

.invitation__details {
  display: grid;
  gap: 0.4cqi;
  font-family: var(--font-khmer-light);
  font-size: clamp(11px, 3cqi, 15.5px);
  line-height: 1.9;
  color: var(--gold-deep);
  text-wrap: balance;
  filter: var(--gold-emboss);
}

.invitation__details address {
  font-style: normal;
}

.invitation__phrase {
  white-space: nowrap;
}

.invitation__value {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 0.95em;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Light sheen that follows the pointer */
.invitation__sheen {
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

.invitation:hover .invitation__sheen {
  opacity: 1;
}

/* ---------- Keyframes ---------- */
@keyframes card-enter {
  from {
    opacity: 0;
    translate: 0 6vh;
    scale: 0.94;
    filter: blur(8px);
  }
  to {
    opacity: 1;
    translate: 0 0;
    scale: 1;
    filter: blur(0);
  }
}

@keyframes content-rise {
  from {
    opacity: 0;
    translate: 0 1.2cqi;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes card-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}

@keyframes shadow-breathe {
  0%, 100% { opacity: 1; scale: 1; }
  50% { opacity: 0.7; scale: 0.94; }
}

@keyframes glow-breathe {
  from { opacity: 0.7; scale: 0.97; }
  to { opacity: 1; scale: 1.03; }
}

@keyframes foil-shimmer {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}

/* ---------- Responsive ---------- */
@media (max-width: 640px) {
  .invitation-stage {
    --card-w: min(92vw, 28rem);
    --lean-x: 2deg;
    --lean-z: -0.8deg;
  }

  .invitation__content {
    padding: 13cqi 12cqi 11cqi;
  }

  .invitation__side {
    display: none;
  }
}
</style>
