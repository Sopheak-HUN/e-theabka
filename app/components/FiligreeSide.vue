<script setup lang="ts">
// Vertical filigree for the middle of the left/right edges, mirrored top to bottom.
withDefaults(defineProps<{ tone?: 'silver' | 'rose' }>(), { tone: 'silver' })

const halves = ['', 'matrix(1 0 0 -1 0 180)']
</script>

<template>
  <svg class="filigree-side" :class="`filigree-side--${tone}`" viewBox="0 0 40 180" aria-hidden="true" focusable="false">
    <g v-for="(h, i) in halves" :key="i" :transform="h">
      <path class="filigree-side__line" d="M20 2C6 24 34 42 20 66 14 76 16 84 20 86" />
      <path class="filigree-side__fill" d="M22 30C32 24 38 14 36 4 28 10 22 20 22 30Z" />
      <path class="filigree-side__fill" d="M18 52C8 50 2 42 2 32 10 36 16 42 18 52Z" />
    </g>
    <path class="filigree-side__fill" d="M20 74C27 80 27 100 20 106 13 100 13 80 20 74Z" />
    <circle class="filigree-side__gold" cx="20" cy="90" r="2.6" />
  </svg>
</template>

<style scoped>
.filigree-side {
  display: block;
  overflow: visible;
}

.filigree-side__fill {
  fill: url(#kh-silver);
}

.filigree-side__line {
  fill: none;
  stroke: url(#kh-silver);
  stroke-width: 1.6;
  stroke-linecap: round;
}

.filigree-side--rose .filigree-side__fill {
  fill: url(#kh-rose);
}

.filigree-side--rose .filigree-side__line {
  stroke: url(#kh-rose);
}

.filigree-side__gold {
  fill: url(#kh-gold-shimmer);
}
</style>
