<script setup lang="ts">
// Invitations lying on the table: a closed folder (cover) or an open spread.
withDefaults(defineProps<{ variant?: 'cover' | 'spread' }>(), { variant: 'cover' })

const programme = [
  ['៧:០០', 'ពិធីហែជំនូន'],
  ['៨:៣០', 'ពិធីកាត់សក់'],
  ['១០:០០', 'ពិធីសំពះផ្ទឹម'],
  ['១១:០០', 'ពិធីចងដៃ'],
]
</script>

<template>
  <div class="backdrop" :class="`backdrop--${variant}`" aria-hidden="true">
    <div v-if="variant === 'spread'" class="backdrop__panel">
      <div class="backdrop__insert">
        <p class="backdrop__title" lang="km">កម្មវិធីមង្គលការ</p>
        <dl class="backdrop__programme" lang="km">
          <div v-for="[time, item] in programme" :key="time">
            <dt>{{ time }}</dt>
            <dd>{{ item }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="backdrop__panel">
      <div class="backdrop__insert">
        <p class="backdrop__title" lang="km">សិរីមង្គលអាពាហ៍ពិពាហ៍</p>
        <MonogramCartouche class="backdrop__monogram" groom="ក" bride="ស" />
        <p class="backdrop__title backdrop__title--small" lang="km">សូមគោរពអញ្ជើញ</p>
        <span class="backdrop__box" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  display: flex;
  rotate: var(--rot, 0deg);
  filter: drop-shadow(0 14px 18px rgba(52, 46, 32, 0.28));
  animation: card-settle 2s var(--ease-silk) var(--delay, 0s) both;
}

.backdrop__panel {
  flex: 1;
  aspect-ratio: 5 / 7;
  container-type: inline-size;
  display: flex;
  padding: 4cqi;
  border-radius: 1cqi;
  background:
    var(--tex-paper),
    radial-gradient(130% 90% at 25% 10%, var(--sage-light), var(--sage) 50%, var(--sage-dark));
}

/* Darker crease where the folder opens */
.backdrop--spread .backdrop__panel:first-child {
  border-radius: 1cqi 0 0 1cqi;
  box-shadow: inset -3cqi 0 4cqi -2cqi rgba(30, 34, 24, 0.45);
}

.backdrop--spread .backdrop__panel:last-child {
  border-radius: 0 1cqi 1cqi 0;
  box-shadow: inset 3cqi 0 4cqi -2cqi rgba(30, 34, 24, 0.35);
}

.backdrop__insert {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 12cqi 13cqi;
  background:
    var(--tex-paper),
    linear-gradient(160deg, #FFFCF5, var(--ivory) 50%, #EEE5D3);
}

/* Rose band with gold edges, and an inner gold hairline */
.backdrop__insert::before,
.backdrop__insert::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.backdrop__insert::before {
  inset: 2.6cqi;
  border: 2.6cqi solid var(--rose);
  box-shadow:
    0 0 0 max(1px, 0.4cqi) var(--gold),
    inset 0 0 0 max(1px, 0.4cqi) var(--gold);
}

.backdrop__insert::after {
  inset: 7cqi;
  border: 1px solid var(--gold);
}

.backdrop__title {
  font-family: var(--font-khmer-display);
  font-size: 6cqi;
  line-height: 1.8;
  background: var(--gold-foil);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.backdrop__title--small {
  font-size: 4.4cqi;
}

.backdrop__monogram {
  width: 36cqi;
}

/* Static gold: these cards are blurred, so a shimmer would only cost repaints */
.backdrop__monogram :deep(.cartouche__fill) {
  fill: url(#kh-gold);
}

.backdrop__monogram :deep(.cartouche__line) {
  stroke: url(#kh-gold);
}

.backdrop__box {
  width: 70%;
  height: 8cqi;
  border: 1px solid var(--ink);
}

.backdrop__programme {
  display: grid;
  gap: 3cqi;
  width: 100%;
  font-family: var(--font-khmer);
  font-size: 4.4cqi;
  line-height: 1.6;
}

.backdrop__programme div {
  display: grid;
  grid-template-columns: 30% 1fr;
  text-align: left;
}

.backdrop__programme dt {
  color: var(--gold-deep);
}

.backdrop__programme dd {
  color: var(--ink);
}

@keyframes card-settle {
  from {
    opacity: 0;
    scale: 1.08;
    translate: 0 -2vh;
  }
  to {
    opacity: 1;
    scale: 1;
    translate: 0 0;
  }
}
</style>
