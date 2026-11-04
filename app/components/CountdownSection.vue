<script setup lang="ts">
// Save-the-date strip: days, hours, minutes and seconds to the reception, in Khmer numerals.
// Rendered on the server; the server's clock travels in the payload so the browser hydrates
// the same numbers, then switches to its own clock and ticks every second from page load.
// Every digit that changes rolls up like an odometer.
const target = new Date(wedding.start).getTime()
const now = useState<number | null>('countdown-now', () => Date.now())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  now.value = Date.now()
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})
onBeforeUnmount(() => clearInterval(timer))

const units = computed(() => {
  const left = now.value === null ? null : Math.max(0, target - now.value)
  const part = (ms: number, mod: number) => (left === null ? null : Math.floor(left / ms) % mod)
  return [
    { km: 'ថ្ងៃ', en: 'days', value: left === null ? null : Math.floor(left / 86_400_000) },
    { km: 'ម៉ោង', en: 'hours', value: part(3_600_000, 24) },
    { km: 'នាទី', en: 'minutes', value: part(60_000, 60) },
    { km: 'វិនាទី', en: 'seconds', value: part(1000, 60) },
  ]
})

const arrived = computed(() => now.value !== null && now.value >= target)
const show = (value: number | null) => (value === null ? '··' : toKhmerDigits(String(value).padStart(2, '0')))
</script>

<template>
  <WeddingSection id="countdown" title-km="រាប់ថ្ងៃរង់ចាំ" title-en="Counting down to our day">
    <div class="countdown">
      <div class="countdown__insert">
        <p v-if="arrived" class="countdown__arrived" lang="km">ថ្ងៃនេះជាថ្ងៃមង្គលការរបស់យើង</p>
        <ol v-else class="countdown__units" aria-live="off">
          <li v-for="unit in units" :key="unit.en" class="countdown__unit">
            <span class="countdown__value" lang="km">
              <span class="visually-hidden">{{ show(unit.value) }}</span>
              <!-- Each digit rolls on its own: the old numeral leaves upwards, the new one rises in -->
              <span
                v-for="(digit, d) in [...show(unit.value)]"
                :key="d"
                class="countdown__digit"
                aria-hidden="true"
              >
                <Transition name="roll">
                  <span :key="digit" class="countdown__glyph">{{ digit }}</span>
                </Transition>
              </span>
            </span>
            <span class="countdown__label" lang="km">{{ unit.km }}</span>
            <span class="countdown__label-en">{{ unit.en }}</span>
          </li>
        </ol>
        <p class="countdown__date">
          <time :datetime="wedding.start" lang="km">
            <span>{{ wedding.dateKm }}</span>
            <span>{{ wedding.timeKm }}</span>
          </time>
        </p>
      </div>
    </div>
  </WeddingSection>
</template>

<style scoped>
/* Sage board with an ivory insert, like a narrow save-the-date card */
.countdown {
  width: min(44rem, 100%);
  margin-inline: auto;
  padding: 0.7rem;
  border-radius: 6px;
  background:
    var(--tex-paper),
    radial-gradient(130% 90% at 25% 10%, var(--sage-light), var(--sage) 45%, var(--sage-dark) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 8px 18px rgba(40, 36, 24, 0.18),
    0 30px 60px -14px rgba(40, 36, 24, 0.4);
  rotate: -0.6deg;
}

.countdown__insert {
  display: grid;
  justify-items: center;
  gap: 1rem;
  padding: clamp(1.25rem, 1rem + 1.5vw, 2rem) clamp(0.75rem, 0.5rem + 2vw, 2.5rem);
  border-radius: 2px;
  background:
    var(--tex-paper),
    radial-gradient(130% 90% at 28% 12%, #FFFCF5 0%, var(--ivory) 45%, #EFE7D7 100%);
  outline: 1px solid rgba(201, 164, 92, 0.7);
  outline-offset: -0.5rem;
}

.countdown__units {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  list-style: none;
}

.countdown__unit {
  display: grid;
  justify-items: center;
  padding-inline: 0.25rem;
}

/* Gold hairlines between the units */
.countdown__unit + .countdown__unit {
  border-left: 1px solid rgba(168, 134, 66, 0.45);
}

.countdown__value {
  display: inline-flex;
  font-family: var(--font-khmer-display);
  font-size: clamp(1.6rem, 1.1rem + 2.6vw, 3rem);
  line-height: 1.5;
  filter: var(--gold-emboss);
}

/* A window one line tall; the numerals roll through it */
.countdown__digit {
  position: relative;
  display: inline-block;
  height: 1.5em;
  overflow: hidden;
}

.countdown__glyph {
  display: block;
  background: var(--gold-foil-text);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.roll-enter-active,
.roll-leave-active {
  transition:
    translate 0.6s var(--ease-silk),
    opacity 0.6s var(--ease-silk);
}

/* The outgoing numeral lies over the incoming one while both move */
.roll-leave-active {
  position: absolute;
  inset: 0 auto auto 0;
}

.roll-enter-from {
  translate: 0 70%;
  opacity: 0;
}

.roll-leave-to {
  translate: 0 -70%;
  opacity: 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.countdown__label {
  font-family: var(--font-khmer);
  font-size: clamp(0.8rem, 0.75rem + 0.25vw, 0.95rem);
  color: var(--ink);
}

.countdown__label-en {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.85rem, 0.8rem + 0.2vw, 1rem);
  color: var(--gold-deep);
}

.countdown__arrived {
  font-family: var(--font-khmer-display);
  font-size: clamp(1.1rem, 0.9rem + 1vw, 1.6rem);
  line-height: 1.8;
  color: var(--gold-deep);
}

.countdown__date {
  padding-top: 0.9rem;
  border-top: 1px dashed rgba(168, 134, 66, 0.4);
  font-family: var(--font-khmer-light);
  font-size: clamp(0.8rem, 0.75rem + 0.3vw, 1rem);
  line-height: 1.8;
  color: var(--gold-deep);
  text-align: center;
}

/* Date, then time; each line stays whole */
.countdown__date span {
  display: block;
}

@media (max-width: 767px) {
  .countdown {
    rotate: none;
  }
}
</style>
