<script setup lang="ts">
// Shared SVG gradients referenced by every ornament via url(#kh-gold…), url(#kh-silver) or url(#kh-rose).
const svg = ref<SVGSVGElement | null>(null)

onMounted(() => {
  // Paused for reduced motion, and on phones/touch where the per-frame repaints cost too much.
  if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px), (pointer: coarse)').matches) {
    svg.value?.pauseAnimations()
  }
})
</script>

<template>
  <svg ref="svg" class="gold-defs" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient
        id="kh-gold"
        gradientUnits="userSpaceOnUse"
        x1="0" y1="0" x2="200" y2="200"
        spreadMethod="reflect"
      >
        <stop offset="0" stop-color="#8C6A2C" />
        <stop offset=".3" stop-color="#C9A45C" />
        <stop offset=".5" stop-color="#EFDCA9" />
        <stop offset=".7" stop-color="#C9A45C" />
        <stop offset="1" stop-color="#A88642" />
      </linearGradient>

      <linearGradient
        id="kh-gold-shimmer"
        gradientUnits="userSpaceOnUse"
        x1="0" y1="0" x2="200" y2="200"
        spreadMethod="reflect"
      >
        <stop offset="0" stop-color="#9A7834" />
        <stop offset=".35" stop-color="#C9A45C" />
        <stop offset=".48" stop-color="#F6E7B8" />
        <stop offset=".56" stop-color="#C9A45C" />
        <stop offset="1" stop-color="#A88642" />
        <animateTransform
          attributeName="gradientTransform"
          type="translate"
          from="0 0"
          to="400 400"
          dur="9s"
          repeatCount="indefinite"
        />
      </linearGradient>

      <linearGradient
        id="kh-silver"
        gradientUnits="userSpaceOnUse"
        x1="0" y1="0" x2="160" y2="160"
        spreadMethod="reflect"
      >
        <stop offset="0" stop-color="#868C80" />
        <stop offset=".4" stop-color="#B9BEB2" />
        <stop offset=".55" stop-color="#E4E6DE" />
        <stop offset=".7" stop-color="#A3A99D" />
        <stop offset="1" stop-color="#7C8276" />
      </linearGradient>

      <linearGradient
        id="kh-rose"
        gradientUnits="userSpaceOnUse"
        x1="0" y1="0" x2="160" y2="160"
        spreadMethod="reflect"
      >
        <stop offset="0" stop-color="#B98582" />
        <stop offset=".4" stop-color="#D9AAA5" />
        <stop offset=".55" stop-color="#F3D9D4" />
        <stop offset=".7" stop-color="#D4A5A0" />
        <stop offset="1" stop-color="#B07C78" />
      </linearGradient>
    </defs>
  </svg>
</template>

<style scoped>
.gold-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
