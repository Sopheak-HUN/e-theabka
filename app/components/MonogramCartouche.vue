<script setup lang="ts">
// Gold oval cartouche with two interlaced initials: one solid, one outlined.
defineProps<{
  groom: string
  bride: string
}>()

const sides = ['', 'matrix(-1 0 0 1 200 0)']
</script>

<template>
  <svg class="cartouche" viewBox="0 0 200 240" role="img" :aria-label="`${groom} & ${bride}`">
    <g v-for="(s, i) in sides" :key="i" :transform="s">
      <!-- crown -->
      <path class="cartouche__line" d="M100 36C90 26 76 26 72 34 68 42 76 48 82 44 86 41 84 36 80 37" />
      <path class="cartouche__fill" d="M86 28C80 18 82 8 92 4 92 14 92 22 86 28Z" />
      <!-- shoulders -->
      <path class="cartouche__fill" d="M52 62C40 58 32 48 32 36 42 42 50 50 52 62Z" />
      <path class="cartouche__line" d="M48 70C36 68 28 76 30 84 32 92 42 92 44 86 45 82 41 79 38 81" />
      <!-- sides -->
      <path class="cartouche__line" d="M36 120C24 112 14 120 16 130 18 140 30 140 32 132 33 127 28 124 25 127" />
      <path class="cartouche__fill" d="M34 102C26 94 24 84 28 74 34 82 36 92 34 102Z" />
      <path class="cartouche__fill" d="M34 142C26 150 24 160 28 170 34 162 36 152 34 142Z" />
      <!-- base -->
      <path class="cartouche__fill" d="M54 182C42 186 34 196 34 208 44 202 52 194 54 182Z" />
      <path class="cartouche__line" d="M100 206C90 214 78 216 70 210 64 205 68 196 76 198 80 199 80 205 76 205" />
    </g>
    <path class="cartouche__fill" d="M100 2C108 10 108 22 100 30 92 22 92 10 100 2Z" />
    <path class="cartouche__fill" d="M100 212C107 220 107 230 100 238 93 230 93 220 100 212Z" />

    <ellipse class="cartouche__line" cx="100" cy="120" rx="62" ry="84" stroke-width="2.4" />
    <ellipse class="cartouche__line" cx="100" cy="120" rx="57" ry="79" stroke-width=".8" />

    <text class="cartouche__initial cartouche__initial--solid" x="88" y="110">{{ groom }}</text>
    <text class="cartouche__initial cartouche__initial--outline" x="114" y="136">{{ bride }}</text>
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
  stroke-width: 1.6;
  stroke-linecap: round;
}

.cartouche__initial {
  font-family: var(--font-khmer-display);
  font-size: 70px;
  text-anchor: middle;
  dominant-baseline: central;
}

.cartouche__initial--solid {
  fill: url(#kh-gold);
}

/* Paper-coloured fill lets the outlined letter weave over the solid one */
.cartouche__initial--outline {
  fill: var(--ivory);
  fill-opacity: 0.85;
  stroke: url(#kh-gold);
  stroke-width: 1.8;
  paint-order: stroke;
}
</style>
