<script setup lang="ts">
// Photo prints scattered on the table, held by gold photo corners. They drop into
// place once when the gallery scrolls into view; tapping one opens it larger.
const photos = wedding.gallery

// A slight, fixed tilt per print so the scatter looks placed, not random on each load
const tilts = [-3.2, 2.1, -1.4, 2.8, -2.4, 1.6]
const tones = ['sage', 'rose', 'beige'] as const

const grid = ref<HTMLElement | null>(null)
const armed = ref(false)
const landed = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!grid.value || !('IntersectionObserver' in window)) return
  armed.value = true
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      landed.value = true
      observer?.disconnect()
    },
    // As soon as the top of the grid is a little way up the screen. On phones the grid is
    // taller than the screen, so waiting for a share of it left empty slots while scrolling.
    { rootMargin: '0px 0px -10% 0px' },
  )
  observer.observe(grid.value)
})
onBeforeUnmount(() => observer?.disconnect())

// ---------- Lightbox ----------
const dialog = ref<HTMLDialogElement | null>(null)
const current = ref(0)
const active = computed(() => photos[current.value]!)

function show(index: number) {
  current.value = index
  dialog.value?.showModal()
}

const step = (by: number) => (current.value = (current.value + by + photos.length) % photos.length)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') step(1)
  else if (event.key === 'ArrowLeft') step(-1)
}

// Clicking the dimmed backdrop (the dialog element itself, outside the mat) closes it
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close()
}

let touchX: number | null = null
const onTouchStart = (event: TouchEvent) => (touchX = event.touches[0]?.clientX ?? null)
function onTouchEnd(event: TouchEvent) {
  const endX = event.changedTouches[0]?.clientX
  if (touchX === null || endX === undefined) return
  const dx = endX - touchX
  if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
  touchX = null
}
</script>

<template>
  <WeddingSection id="gallery" title-km="កម្រងរូបភាពអនុស្សាវរីយ៍" title-en="Moments we have gathered">
    <ul ref="grid" class="gallery" :class="{ 'is-armed': armed, 'is-landed': landed }">
      <li
        v-for="(photo, i) in photos"
        :key="i"
        class="print"
        :class="`print--${photo.shape}`"
        :style="{ '--tilt': `${tilts[i % tilts.length]}deg`, '--i': i }"
      >
        <button type="button" class="print__button" :aria-label="`Open photo: ${photo.alt}`" @click="show(i)">
          <span class="print__photo">
            <img v-if="photo.src" :src="photo.src" :alt="photo.alt" loading="lazy" decoding="async">
            <span v-else class="print__placeholder" :class="`print__placeholder--${tones[i % tones.length]}`">
              <span lang="km">{{ toKhmerDigits(i + 1) }}</span>
            </span>
            <span class="print__corner print__corner--tl" aria-hidden="true" />
            <span class="print__corner print__corner--tr" aria-hidden="true" />
            <span class="print__corner print__corner--bl" aria-hidden="true" />
            <span class="print__corner print__corner--br" aria-hidden="true" />
          </span>
          <span class="print__caption">{{ photo.caption }}</span>
        </button>
      </li>
    </ul>

    <dialog
      ref="dialog"
      class="lightbox"
      aria-label="Photo"
      @click="onDialogClick"
      @keydown="onKeydown"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <figure class="lightbox__mat">
        <div class="lightbox__photo" :class="`print--${active.shape}`">
          <img v-if="active.src" :src="active.src" :alt="active.alt">
          <span v-else class="print__placeholder" :class="`print__placeholder--${tones[current % tones.length]}`">
            <span lang="km">{{ toKhmerDigits(current + 1) }}</span>
          </span>
        </div>
        <figcaption class="lightbox__caption">{{ active.caption }}</figcaption>
      </figure>

      <div class="lightbox__controls">
        <button type="button" class="wedding-button lightbox__nav" aria-label="Previous photo" @click="step(-1)">
          <span class="wedding-button__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7" /></svg>
          </span>
        </button>
        <p class="lightbox__count" lang="km">{{ toKhmerDigits(current + 1) }} / {{ toKhmerDigits(photos.length) }}</p>
        <button type="button" class="wedding-button lightbox__nav" aria-label="Next photo" @click="step(1)">
          <span class="wedding-button__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
          </span>
        </button>
        <form method="dialog">
          <button class="wedding-button">
            <span class="wedding-button__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17" /></svg>
            </span>
            <span lang="km">បិទ</span>
            <span class="wedding-button__en">Close</span>
          </button>
        </form>
      </div>
    </dialog>
  </WeddingSection>
</template>

<style scoped>
/* ---------- Scatter ---------- */
.gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: clamp(1.25rem, 0.5rem + 3vw, 3rem) clamp(1rem, 0.5rem + 2.5vw, 2.5rem);
  list-style: none;
}

/* Every other print sits a little lower, so the rows don't read as a grid */
.print:nth-child(3n + 2) {
  translate: 0 1.5rem;
}

.print {
  rotate: var(--tilt);
}

.print__button {
  display: block;
  width: 100%;
  padding: 0.6rem 0.6rem 0;
  border: 0;
  border-radius: 2px;
  background:
    var(--tex-paper),
    linear-gradient(170deg, #FFFDF7, var(--ivory) 60%, #EFE7D7);
  box-shadow:
    0 1px 2px rgba(40, 36, 24, 0.22),
    0 10px 22px -6px rgba(40, 36, 24, 0.3),
    0 28px 50px -24px rgba(40, 36, 24, 0.4);
  cursor: zoom-in;
  transition:
    rotate 0.6s var(--ease-silk),
    scale 0.6s var(--ease-silk),
    box-shadow 0.6s var(--ease-silk);
}

.print__button:focus-visible {
  outline: 2px solid var(--gold-deep);
  outline-offset: 4px;
}

/* Lifting a print straightens it, as if picked up off the table */
@media (hover: hover) {
  .print__button:hover {
    rotate: calc(var(--tilt) * -1);
    scale: 1.04;
    box-shadow:
      0 2px 4px rgba(40, 36, 24, 0.2),
      0 22px 40px -10px rgba(40, 36, 24, 0.35),
      0 46px 70px -30px rgba(40, 36, 24, 0.4);
  }
}

.print__photo {
  position: relative;
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #DCCFB8;
}

.print--landscape .print__photo,
.lightbox__photo.print--landscape {
  aspect-ratio: 5 / 4;
}

.print--square .print__photo,
.lightbox__photo.print--square {
  aspect-ratio: 1;
}

.print__photo img,
.lightbox__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Until real photos are added: tinted paper with the print's number in Moul */
.print__placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: var(--tex-paper), var(--tint);
  font-family: var(--font-khmer-display);
  font-size: clamp(1.5rem, 1rem + 2vw, 2.6rem);
  color: rgba(255, 252, 240, 0.75);
}

.print__placeholder--sage {
  --tint: radial-gradient(120% 90% at 30% 20%, var(--sage-light), var(--sage) 60%, var(--sage-dark));
}

.print__placeholder--rose {
  --tint: radial-gradient(120% 90% at 30% 20%, #E8C4BF, var(--rose) 60%, var(--rose-deep));
}

.print__placeholder--beige {
  --tint: radial-gradient(120% 90% at 30% 20%, #EFE5D2, #D9CBB0 60%, #BFAE8E);
}

/* Gold photo corners holding the print to the page */
.print__corner {
  position: absolute;
  width: 1.4rem;
  height: 1.4rem;
  background: var(--gold-foil);
  background-size: 300% 300%;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  filter: drop-shadow(0 1px 1px rgba(60, 44, 16, 0.35));
}

.print__corner--tl { top: 0; left: 0; }
.print__corner--tr { top: 0; right: 0; scale: -1 1; }
.print__corner--bl { bottom: 0; left: 0; scale: 1 -1; }
.print__corner--br { bottom: 0; right: 0; scale: -1 -1; }

.print__caption {
  display: block;
  padding: 0.55rem 0.25rem 0.7rem;
  font-family: var(--font-script);
  font-size: clamp(1.1rem, 0.95rem + 0.6vw, 1.5rem);
  line-height: 1.2;
  color: var(--gold-ink);
  text-align: center;
}

/* ---------- The one entrance: prints drop onto the table ---------- */
.gallery.is-armed .print {
  opacity: 0;
}

.gallery.is-landed .print {
  animation: print-drop 1.1s var(--ease-silk) both;
  animation-delay: calc(var(--i) * 0.11s);
}

/* No translate in "to": each print settles back onto its own row offset */
@keyframes print-drop {
  from {
    opacity: 0;
    translate: 0 -2.5rem;
    rotate: calc(var(--tilt) + 9deg);
    scale: 1.08;
  }
  60% {
    opacity: 1;
  }
  to {
    opacity: 1;
    rotate: var(--tilt);
    scale: 1;
  }
}

/* ---------- Lightbox ---------- */
.lightbox {
  width: min(40rem, calc(100vw - 1.5rem));
  max-width: none;
  max-height: calc(100dvh - 1.5rem);
  margin: auto;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
}

.lightbox::backdrop {
  background: rgba(38, 34, 24, 0.72);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.lightbox[open] {
  display: grid;
  justify-items: center;
  gap: 1rem;
  animation: lightbox-in 0.5s var(--ease-silk) both;
}

.lightbox__mat {
  width: 100%;
  padding: 0.8rem 0.8rem 0;
  border-radius: 2px;
  background:
    var(--tex-paper),
    linear-gradient(170deg, #FFFDF7, var(--ivory) 60%, #EFE7D7);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.6);
}

.lightbox__photo {
  aspect-ratio: 4 / 5;
  max-height: calc(100dvh - 12rem);
  margin-inline: auto;
  overflow: hidden;
}

.lightbox__caption {
  padding: 0.7rem 0 0.9rem;
  font-family: var(--font-script);
  font-size: clamp(1.4rem, 1.1rem + 1vw, 2rem);
  color: var(--gold-ink);
  text-align: center;
}

.lightbox__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.lightbox__nav {
  padding: 0.4rem;
}

.lightbox__count {
  min-width: 4rem;
  font-family: var(--font-khmer-light);
  color: var(--ivory);
  text-align: center;
}

@keyframes lightbox-in {
  from {
    opacity: 0;
    scale: 0.96;
  }
}

/* ---------- Phones: two columns, gentler tilt ---------- */
@media (max-width: 767px) {
  .gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .print {
    rotate: calc(var(--tilt) * 0.6);
  }

  .print:nth-child(3n + 2) {
    translate: none;
  }

  .print:nth-child(even) {
    translate: 0 1rem;
  }

  .print__button {
    padding: 0.4rem 0.4rem 0;
  }

  .print__corner {
    width: 1rem;
    height: 1rem;
  }
}
</style>
