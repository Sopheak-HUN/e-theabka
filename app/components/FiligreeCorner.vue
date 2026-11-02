<script setup lang="ts">
// Baroque acanthus filigree, drawn for the top-left corner.
// The second pass mirrors every motif across the diagonal for symmetry.
const mirrors = ['', 'matrix(0 1 1 0 0 0)']
</script>

<template>
  <svg class="filigree-corner" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <path class="filigree-corner__line filigree-corner__line--bold" d="M10 64C10 34 34 10 64 10" />
    <g v-for="(m, i) in mirrors" :key="i" :transform="m">
      <path class="filigree-corner__line" d="M64 10C80 8 90 18 84 28 80 34 72 32 72 26 72 22 77 21 78 24" />
      <path class="filigree-corner__fill" d="M68 12C80 2 98 2 112 10 98 14 82 16 68 12Z" />
      <path class="filigree-corner__fill" d="M84 30C94 30 102 36 104 46 94 44 88 38 84 30Z" />
      <path class="filigree-corner__line" d="M30 30C46 30 54 40 50 50 47 56 40 54 41 49" />
      <path class="filigree-corner__fill" d="M52 22C58 14 66 12 74 14 68 20 60 22 52 22Z" />
      <circle class="filigree-corner__fill" cx="117" cy="9" r="1.8" />
    </g>
    <path class="filigree-corner__fill" d="M4 4C22 8 30 18 30 30 18 30 8 22 4 4Z" />
    <circle class="filigree-corner__fill" cx="40" cy="40" r="3" />
    <!-- tiny gold rosette, as on foil-stamped corners -->
    <circle class="filigree-corner__gold" cx="17" cy="17" r="3.4" />
  </svg>
</template>

<style scoped>
.filigree-corner {
  display: block;
  overflow: visible;
}

.filigree-corner__fill {
  fill: url(#kh-silver);
}

.filigree-corner__line {
  fill: none;
  stroke: url(#kh-silver);
  stroke-width: 2.2;
  stroke-linecap: round;
}

.filigree-corner__line--bold {
  stroke-width: 3.4;
}

.filigree-corner__gold {
  fill: url(#kh-gold-shimmer);
}
</style>
