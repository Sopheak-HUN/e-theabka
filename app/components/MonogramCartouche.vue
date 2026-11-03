<script setup lang="ts">
// Rococo gold cartouche: an oval wreathed in scroll motifs, a shell crest top and
// bottom, and two interlaced initials — one solid, one double-outlined.
defineProps<{
  groom: string
  bride: string
}>()

const cx = 110
const cy = 136
const rx = 60
const ry = 84

// Scroll motifs placed around the oval, skipping the crest zones at top and bottom.
const motifs = Array.from({ length: 22 }, (_, i) => -90 + (i * 360) / 22)
  .filter((deg) => Math.abs(deg + 90) > 28 && Math.abs(deg - 90) > 24)
  .map((deg) => {
    const t = (deg * Math.PI) / 180
    const x = cx + (rx + 7) * Math.cos(t)
    const y = cy + (ry + 7) * Math.sin(t)
    const normal = (Math.atan2(Math.sin(t) / ry, Math.cos(t) / rx) * 180) / Math.PI
    const large = Math.abs(Math.sin(t)) < 0.2
    return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(normal + 90).toFixed(2)}) scale(${large ? 1.25 : 1})`
  })

const mirror = ['', 'scale(-1 1)']
</script>

<template>
  <svg class="cartouche" viewBox="0 0 220 272" role="img" :aria-label="`${groom} & ${bride}`">
    <!-- Wreath of scrolls; local -y points away from the oval -->
    <g v-for="(m, i) in motifs" :key="i" :transform="m">
      <g v-for="(s, j) in mirror" :key="j" :transform="s">
        <path class="cartouche__line" d="M1 0C5 -7 13 -8 14 -2 15 2 10 4 9 0" />
      </g>
      <path class="cartouche__fill" d="M0 -1C3 -6 3 -11 0 -15 -3 -11 -3 -6 0 -1Z" />
      <circle class="cartouche__fill" cx="0" cy="2.5" r="1.6" />
    </g>

    <!-- Shell crest, top -->
    <g :transform="`translate(${cx} ${cy - ry - 4})`">
      <g v-for="(s, j) in mirror" :key="j" :transform="s">
        <path class="cartouche__fill" d="M0 0C-4 -9 -10 -18 -18 -22 -14 -14 -8 -6 0 0Z" />
        <path class="cartouche__line" d="M3 -1C15 -2 23 -10 19 -20 16 -27 7 -24 9 -18" />
        <path class="cartouche__line" d="M5 3C21 7 36 1 38 -11 39 -19 30 -21 29 -15" />
        <path class="cartouche__fill" d="M10 -5C19 -17 31 -20 42 -16 31 -10 20 -6 10 -5Z" />
      </g>
      <path class="cartouche__fill" d="M0 0C-6 -10 -6 -24 0 -32 6 -24 6 -10 0 0Z" />
      <circle class="cartouche__fill" cx="0" cy="-36" r="2.4" />
    </g>

    <!-- Smaller shell and drop, bottom -->
    <g :transform="`translate(${cx} ${cy + ry + 4}) scale(0.72 -0.72)`">
      <g v-for="(s, j) in mirror" :key="j" :transform="s">
        <path class="cartouche__fill" d="M0 0C-4 -9 -10 -18 -18 -22 -14 -14 -8 -6 0 0Z" />
        <path class="cartouche__line" d="M3 -1C15 -2 23 -10 19 -20 16 -27 7 -24 9 -18" />
        <path class="cartouche__line" d="M5 3C21 7 36 1 38 -11 39 -19 30 -21 29 -15" />
      </g>
      <path class="cartouche__fill" d="M0 0C-6 -10 -6 -24 0 -32 6 -24 6 -10 0 0Z" />
    </g>

    <!-- Oval: heavy outer ring, fine inner ring -->
    <ellipse class="cartouche__line" :cx="cx" :cy="cy" :rx="rx" :ry="ry" stroke-width="3" />
    <ellipse class="cartouche__line" :cx="cx" :cy="cy" :rx="rx - 5" :ry="ry - 5" stroke-width=".8" />

    <!-- Solid initial -->
    <text class="cartouche__initial cartouche__initial--solid" x="100" y="124">{{ groom }}</text>

    <!-- Double-outlined initial woven over it: gold rim, paper gap, gold inline -->
    <g class="cartouche__inline">
      <text class="cartouche__initial cartouche__initial--rim" x="126" y="158">{{ bride }}</text>
      <text class="cartouche__initial cartouche__initial--gap" x="126" y="158">{{ bride }}</text>
      <text class="cartouche__initial cartouche__initial--line" x="126" y="158">{{ bride }}</text>
    </g>
  </svg>
</template>

<style scoped>
.cartouche {
  display: block;
  overflow: visible;
}

.cartouche__fill {
  fill: url(#kh-gold-shimmer);
}

.cartouche__line {
  fill: none;
  stroke: url(#kh-gold-shimmer);
  stroke-width: 1.8;
  stroke-linecap: round;
}

.cartouche__initial {
  font-family: var(--font-khmer-display);
  font-size: 82px;
  text-anchor: middle;
  dominant-baseline: central;
  stroke-linejoin: round;
}

.cartouche__initial--solid {
  fill: url(#kh-gold);
  stroke: url(#kh-gold);
  stroke-width: 2;
}

.cartouche__initial--rim {
  fill: url(#kh-gold);
  stroke: url(#kh-gold);
  stroke-width: 7;
}

.cartouche__initial--gap {
  fill: var(--ivory);
  stroke: var(--ivory);
  stroke-width: 3.6;
}

.cartouche__initial--line {
  fill: var(--ivory);
  stroke: url(#kh-gold);
  stroke-width: 1.1;
}

@media (max-width: 767px), (pointer: coarse) {
  .cartouche__fill {
    fill: url(#kh-gold);
  }

  .cartouche__line {
    stroke: url(#kh-gold);
  }
}
</style>
