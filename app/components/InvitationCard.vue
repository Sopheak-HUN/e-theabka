<script setup lang="ts">
// Personalise the guest box with ?to=Guest%20Name in the link.
const guest = useRequestURL().searchParams.get('to') ?? ''

// Names, parents, date, venue and the order of ceremonies all come from app/data/wedding.jsonc
const { groom, bride, venue, programme } = wedding

const open = ref(false)
// Phones only: the book has room reserved above it for the upper page.
const raised = ref(false)
const stage = ref<HTMLElement | null>(null)
const book = ref<HTMLElement | null>(null)

let canTilt = false
let reducedMotion = false
let stackedLayout: MediaQueryList | undefined
let lowerTimer: ReturnType<typeof setTimeout> | undefined
let glideFrame = 0
// Where the closed card sat before opening (phones), so closing can glide back to it.
let closedBookTop = 0
let closedScroll = 0

// Layout position, ignoring the book's lean and lift transforms: they differ between
// open and closed, so measuring through them makes closing land a few px off.
const bookTop = () => {
  let top = 0
  for (let el: HTMLElement | null = book.value; el; el = el.offsetParent as HTMLElement | null) top += el.offsetTop
  return top
}
const bookDuration = () =>
  reducedMotion ? 0 : parseFloat(getComputedStyle(stage.value!).getPropertyValue('--dur-book')) * 1000

// Our own eased scroll, so the page moves in step with the cover rather than
// at whatever speed the browser picks for "smooth". A touch or wheel cancels it.
function glideTo(top: number, duration: number) {
  cancelAnimationFrame(glideFrame)
  const from = window.scrollY
  const distance = top - from
  if (!duration || Math.abs(distance) < 1) {
    window.scrollTo({ top, behavior: 'instant' })
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
    window.scrollTo({ top: from + distance * eased, behavior: 'instant' })
    if (t < 1) glideFrame = requestAnimationFrame(step)
  }
  glideFrame = requestAnimationFrame(step)
}

const cancelGlide = () => cancelAnimationFrame(glideFrame)

// Change the reserved room without the card visibly jumping: measure where the
// book sits before and after, then scroll by the difference. Nothing here animates
// layout, so only the cover flip (a transform) runs per frame.
async function setRaised(value: boolean) {
  if (!book.value || !stage.value) return
  stage.value.style.setProperty('--book-h', `${book.value.offsetHeight}px`)
  const before = book.value.getBoundingClientRect().bottom
  raised.value = value
  if (!value) stage.value.style.removeProperty('padding-bottom')
  await nextTick()
  const after = book.value.getBoundingClientRect().bottom
  window.scrollBy({ top: after - before, behavior: 'instant' })
}

async function toggle() {
  resetTilt()
  clearTimeout(lowerTimer)
  cancelGlide()

  if (!stackedLayout?.matches || !book.value || !stage.value) {
    open.value = !open.value
    return
  }

  if (!open.value) {
    // Phones: make room above first, then flip the cover up and glide to the top page.
    if (!raised.value) {
      closedBookTop = bookTop()
      closedScroll = window.scrollY
      await setRaised(true)
    }
    open.value = true
    glideTo(stage.value.getBoundingClientRect().top + window.scrollY, bookDuration() * 0.8)
  } else {
    open.value = false
    // While the cover folds down, glide so the card ends exactly where it started.
    // If the page is too short to scroll that far, add temporary room at the bottom.
    const target = bookTop() - (closedBookTop - closedScroll)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    if (target > maxScroll) stage.value.style.paddingBottom = `${Math.ceil(target - maxScroll)}px`
    glideTo(target, bookDuration() * 0.9)
    // Then give the room back; the card is already in place, so nothing moves.
    lowerTimer = setTimeout(() => setRaised(false), bookDuration())
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) toggle()
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion
  stackedLayout = window.matchMedia('(max-width: 767px)')
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('touchstart', cancelGlide, { passive: true })
  window.addEventListener('wheel', cancelGlide, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('touchstart', cancelGlide)
  window.removeEventListener('wheel', cancelGlide)
  clearTimeout(lowerTimer)
  cancelGlide()
})

// Gentle pointer-follow tilt plus a moving light sheen, while the book is closed.
function onPointerMove(event: PointerEvent) {
  if (!canTilt || open.value || !book.value) return
  const rect = book.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  const style = book.value.style
  style.setProperty('--ry', `${((x - 0.5) * 6).toFixed(2)}deg`)
  style.setProperty('--rx', `${((0.5 - y) * 5).toFixed(2)}deg`)
  style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
  style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
}

function resetTilt() {
  if (!book.value) return
  for (const prop of ['--rx', '--ry', '--gx', '--gy']) {
    book.value.style.removeProperty(prop)
  }
}
</script>

<template>
  <div ref="stage" class="invitation-stage" :class="{ 'is-open': open, 'is-raised': raised }">
    <div class="invitation-glow" aria-hidden="true" />
    <div class="invitation-shadow" aria-hidden="true" />

    <div class="invitation-float">
      <div ref="book" class="book" @pointermove="onPointerMove" @pointerleave="resetTilt">
        <!-- Inside right page: revealed when the cover opens. Both inside pages are in the
             server HTML on purpose: they are taller than the cover and stretch it to match,
             so adding them later made the card visibly jump taller. -->
        <section
          id="invitation-inside"
          class="book__page"
          aria-labelledby="programme-title"
          :inert="!open"
        >
          <InvitationPaper>
            <header class="inside-item" style="--i: 0">
              <h2 id="programme-title" class="inside__title" lang="km">របៀបវារៈកម្មវិធី</h2>
              <p class="inside__subtitle">Order of Ceremonies</p>
            </header>

            <div class="programme">
              <section
                v-for="(day, d) in programme"
                :key="day.dayKm"
                class="programme__day inside-item"
                :style="{ '--i': d + 1 }"
                :aria-label="day.dayEn"
              >
                <h3 class="programme__day-title">
                  <span lang="km">{{ day.dayKm }}</span>
                  <small>{{ day.dayEn }}</small>
                </h3>
                <ol class="programme__steps">
                  <li v-for="step in day.steps" :key="step.km" class="programme__step">
                    <span class="programme__time" lang="km">
                      {{ step.time }}
                      <small>{{ step.period }}</small>
                    </span>
                    <span class="programme__name">
                      <span lang="km">{{ step.km }}</span>
                      <small>{{ step.en }}</small>
                    </span>
                  </li>
                </ol>
              </section>
            </div>

            <p class="inside__closing inside-item" lang="km" style="--i: 4">សូមអរគុណ</p>
          </InvitationPaper>
        </section>

        <!-- Cover: front of the folder, with the left inside page on its back -->
        <div class="book__cover" @click="toggle">
          <article
            class="book__face book__face--front"
            aria-labelledby="invitation-title"
            :inert="open"
          >
            <InvitationPaper class="cover-paper">
              <h1 id="invitation-title" class="invitation__title cover-item" lang="km" style="--i: 0">
                សិរីមង្គលអាពាហ៍ពិពាហ៍
              </h1>

              <!-- Initials, names, date and venue: app/data/wedding.jsonc -->
              <MonogramCartouche class="invitation__monogram cover-item" :groom="groom.initial" :bride="bride.initial" style="--i: 1" />

              <div class="invitation__guest cover-item" style="--i: 2">
                <p class="invitation__invite" lang="km">សូមគោរពអញ្ជើញ</p>
                <p class="invitation__guest-box">
                  <span v-if="guest" class="invitation__guest-name">{{ guest }}</span>
                </p>
              </div>

              <div class="invitation__details cover-item" lang="km" style="--i: 3">
                <!-- Line 1: date and time · Line 2: venue -->
                <p>
                  <time :datetime="weddingDate.iso">{{ wedding.dateKm }}</time>
                  <time :datetime="weddingDate.isoTime">{{ wedding.timeKm }}</time>
                </p>
                <address>
                  ប្រារព្ធនៅ{{ venue.km }} {{ venue.cityKm }}
                </address>
              </div>
            </InvitationPaper>
          </article>

          <!-- Left inside page: bilingual invitation text -->
          <section
            class="book__face book__face--back"
            aria-labelledby="detail-title"
            :inert="!open"
          >
            <InvitationPaper class="detail-paper" tone="rose">
              <h2 id="detail-title" class="detail__title inside-item" lang="km" style="--i: 0">
                សិរីមង្គលអាពាហ៍ពិពាហ៍
              </h2>

              <!-- Khmer: parents of the groom (left) and bride (right) -->
              <div class="detail__families inside-item" lang="km" style="--i: 1">
                <p class="detail__parents">
                  <span>{{ groom.father.km }}</span>
                  <span>{{ groom.mother.km }}</span>
                </p>
                <p class="detail__invite">សូមគោរពអញ្ជើញ</p>
                <p class="detail__parents">
                  <span>{{ bride.father.km }}</span>
                  <span>{{ bride.mother.km }}</span>
                </p>
              </div>

              <p class="detail__message inside-item" lang="km" style="--i: 2">
                មានកិត្តិយសសូមគោរពអញ្ជើញ សម្តេច ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា
                អញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធិពរជ័យ សិរីសួស្តី
                ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍ កូនប្រុស កូនស្រី របស់យើងខ្ញុំ
              </p>

              <div class="detail__couple inside-item" lang="km" style="--i: 3">
                <p>
                  <span class="detail__label">កូនប្រុសនាម</span>
                  <span class="detail__name">{{ groom.km }}</span>
                </p>
                <p>
                  <span class="detail__label">កូនស្រីនាម</span>
                  <span class="detail__name">{{ bride.km }}</span>
                </p>
              </div>

              <p class="detail__message inside-item" lang="km" style="--i: 4">
                ដែលនឹងប្រព្រឹត្តទៅនៅ<span class="invitation__phrase"><time :datetime="weddingDate.iso">{{ wedding.dateKm }}</time></span>
                <span class="invitation__phrase"><time :datetime="weddingDate.isoTime">{{ wedding.timeKm }}</time></span>
                នៅ{{ venue.km }} {{ venue.cityKm }}
              </p>

              <span class="detail__rule inside-item" aria-hidden="true" style="--i: 5" />

              <!-- English -->
              <div class="detail__families detail__families--en inside-item" style="--i: 6">
                <p class="detail__parents">
                  <span>{{ groom.father.en }}</span>
                  <span>{{ groom.mother.en }}</span>
                </p>
                <p class="detail__parents">
                  <span>{{ bride.father.en }}</span>
                  <span>{{ bride.mother.en }}</span>
                </p>
              </div>

              <p class="detail__request inside-item" style="--i: 7">
                Request the pleasure of your presence on this auspicious occasion
                of the wedding reception of our children
              </p>

              <p class="detail__script inside-item" style="--i: 8">
                <span class="nowrap">{{ groom.en }} &amp;</span> <span class="nowrap">{{ bride.en }}</span>
              </p>

              <time class="detail__date inside-item" :datetime="weddingDate.iso" style="--i: 9">
                <span class="detail__date-side">{{ weddingDate.weekday }}</span>
                <span class="detail__date-day">
                  {{ weddingDate.day }}
                  <small>{{ weddingDate.year }}</small>
                </span>
                <span class="detail__date-side">{{ weddingDate.month }}</span>
              </time>

              <p class="detail__venue inside-item" style="--i: 10">{{ venue.en }}, {{ venue.cityEn }}</p>
            </InvitationPaper>
          </section>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="invitation-hint"
      aria-controls="invitation-inside"
      :aria-expanded="open"
      @click="toggle"
    >
      <span class="invitation-hint__icon" aria-hidden="true">
        <svg v-if="!open" viewBox="0 0 24 24">
          <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Zm0 0v13" />
        </svg>
        <svg v-else viewBox="0 0 24 24">
          <path d="M7 7l10 10M17 7 7 17" />
        </svg>
      </span>
      <span lang="km">{{ open ? 'បិទធៀប' : 'ចុចដើម្បីបើកមើល' }}</span>
      <span class="invitation-hint__en">{{ open ? 'Close' : 'Tap to open' }}</span>
    </button>
  </div>
</template>

<style scoped>
/* ---------- Stage: sizing, entrance, ambient light ---------- */
.invitation-stage {
  --card-w: min(31rem, 86vw, calc((100vh - 15rem) * 0.714));
  --lean-x: 5deg;
  --lean-z: -2.4deg;
  --peek: y -16deg;
  --peek-rest: y 0deg;
  --peel: rotateY(-9deg);

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--card-w);
  container-type: inline-size;
  transition: width var(--dur-book) var(--ease-book);
  animation: card-enter var(--dur-enter) var(--ease-silk) 0.35s both;
}

/* Open spread: two pages side by side must fit the viewport */
.invitation-stage.is-open {
  --card-w: min(31rem, 45vw, calc((100vh - 15rem) * 0.714));
  --lean-x: 0deg;
  --lean-z: 0deg;
}

@supports (height: 100svh) {
  .invitation-stage {
    --card-w: min(31rem, 86vw, calc((100svh - 15rem) * 0.714));
  }

  .invitation-stage.is-open {
    --card-w: min(31rem, 45vw, calc((100svh - 15rem) * 0.714));
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
  transition: inset var(--dur-book) var(--ease-book);
  animation: glow-breathe var(--dur-glow) ease-in-out infinite alternate;
}

.invitation-shadow {
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: 2rem;
  height: 12%;
  z-index: -1;
  background: radial-gradient(closest-side, rgba(52, 46, 32, 0.45), transparent);
  filter: blur(16px);
  pointer-events: none;
  transition:
    left var(--dur-book) var(--ease-book),
    right var(--dur-book) var(--ease-book);
  animation: shadow-breathe var(--dur-float) ease-in-out infinite;
}

.is-open .invitation-glow {
  inset: -20% -95%;
}

.is-open .invitation-shadow {
  left: -46%;
  right: -46%;
}

/* Phones: skip the breathing glow to avoid per-frame blur repaints */
@media (max-width: 767px), (pointer: coarse) {
  .invitation-glow {
    animation: none;
    filter: blur(16px);
  }

  .invitation-shadow {
    animation: none;
  }

  .invitation-float {
    animation: none;
  }
}

.invitation-float {
  width: 100%;
  perspective: 2000px;
  animation: card-float var(--dur-float) ease-in-out infinite;
}

/* ---------- Book ---------- */
.book {
  --rx: 0deg;
  --ry: 0deg;
  --lift: 1;

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  transform-style: preserve-3d;
  transform:
    rotateX(calc(var(--lean-x) + var(--rx)))
    rotateY(var(--ry))
    rotate(var(--lean-z))
    scale(var(--lift));
  transition:
    transform 0.8s var(--ease-silk),
    translate var(--dur-book) var(--ease-book);
}

.book > * {
  grid-area: 1 / 1;
}

/* Hover-capable pointers only: a tap leaves a sticky :hover on phones, which
   would swell the card just after it closes. */
@media (hover: hover) {
  .invitation-stage:not(.is-open) .book:hover {
    --lift: 1.015;
  }
}

/* Shift right by half a page so the open spread stays centred */
.is-open .book {
  translate: 50% 0;
}

/* The inside page is hidden while closed so its edges can't show around the
   lifted cover; on close it stays visible until the cover has swung shut. */
.book__page {
  display: flex;
  transform: translateZ(-2px);
  visibility: hidden;
  transition: visibility 0s linear var(--dur-book);
}

/* translateZ keeps the page behind the cover during the flip, but under the perspective it
   also shrinks the page a hair, so the browser resamples the text and it looks soft. Once
   the cover is fully open the page lies flat (crisp text); on close it steps back at once. */
.is-open .book__page {
  visibility: visible;
  transform: none;
  transition:
    visibility 0s,
    transform 0s linear var(--dur-book);
}

.book__cover {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  transform-style: preserve-3d;
  transform-origin: left center;
  cursor: pointer;
  transition: transform var(--dur-book) var(--ease-book);
  animation: cover-peek 1.8s var(--ease-silk) 3.4s both;
}

@media (hover: hover) {
  .invitation-stage:not(.is-open) .book__cover:hover {
    transform: var(--peel);
  }
}

.is-open .book__cover {
  transform: rotateY(-180deg);
}

.book__face {
  /* The cover crosses 90° at 44% of the flip with --ease-book, in both directions */
  --edge-on: calc(var(--dur-book) * 0.44);

  display: flex;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* Safari ignores backface-visibility for composited children (gold text, SVG
     filters, the sheen), so each side is also hidden outright once it turns away. */
  transition: visibility 0s linear var(--edge-on);
}

.is-open .book__face--front,
.invitation-stage:not(.is-open) .book__face--back {
  visibility: hidden;
}

.book__cover > .book__face {
  grid-area: 1 / 1;
}

.book__face--back {
  transform: rotateY(180deg);
}

/* ---------- Cover content ---------- */
.cover-item {
  animation: content-rise 1.2s var(--ease-silk) both;
  animation-delay: calc(1.1s + var(--i, 0) * 0.14s);
}

.invitation__title,
.invitation__invite,
.inside__title {
  background: var(--gold-foil-text);
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
  width: 46cqi;
  filter: var(--gold-emboss) drop-shadow(0 2px 3px rgba(168, 134, 66, 0.2));
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

/* Two printed lines: date and time, then venue */
.cover-paper :deep(.paper-board__content) {
  padding-inline: 9cqi;
}

.invitation__details {
  display: grid;
  gap: 0.2cqi;
  font-family: var(--font-khmer-light);
  /* Sized so the date-and-time line (about 33em) fits the cover's text width */
  font-size: clamp(10px, 2.25cqi, 13px);
  line-height: 1.9;
  color: var(--gold-deep);
  white-space: nowrap;
  filter: var(--gold-emboss);
}

/* Below this width the line would need text smaller than 10px, so let it wrap evenly */
@container (max-width: 440px) {
  .invitation__details {
    white-space: normal;
    text-wrap: balance;
  }
}

.invitation__details address {
  font-style: normal;
}

/* Keep each phrase together where it fits, but let it wrap on narrow cards */
.invitation__phrase {
  display: inline-block;
  max-width: 100%;
}

/* ---------- Inside pages ---------- */
.is-open .inside-item {
  animation: content-rise 1s var(--ease-silk) both;
  animation-delay: calc(0.7s + var(--i, 0) * 0.12s);
}

.inside__title {
  font-family: var(--font-khmer-display);
  font-weight: 400;
  font-size: clamp(15px, 5cqi, 26px);
  line-height: 1.8;
}

.inside__subtitle {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(9px, 2.3cqi, 12.5px);
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--gold-deep);
}

/* Order of ceremonies: a heading per day, then time | ceremony rows */
.programme {
  display: grid;
  gap: 3cqi;
  width: 100%;
}

.programme__day {
  display: grid;
  gap: 1.4cqi;
}

/* Day heading between two gold hairlines */
.programme__day-title {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 2.4cqi;
  font-weight: 400;
}

.programme__day-title::before,
.programme__day-title::after {
  content: "";
  grid-row: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(168, 134, 66, 0.6));
}

.programme__day-title::before {
  grid-column: 1;
}

.programme__day-title::after {
  grid-column: 3;
  background: linear-gradient(90deg, rgba(168, 134, 66, 0.6), transparent);
}

.programme__day-title span {
  grid-column: 2;
  grid-row: 1;
  font-family: var(--font-khmer-light);
  font-size: clamp(11px, 2.9cqi, 15px);
  line-height: 1.7;
  color: var(--gold-ink);
}

.programme__day-title small {
  grid-column: 1 / -1;
  grid-row: 2;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(9.5px, 2.2cqi, 12px);
  line-height: 1.2;
  color: var(--gold-deep);
}

.programme__steps {
  display: grid;
  gap: 1cqi;
  list-style: none;
}

.programme__step {
  display: grid;
  grid-template-columns: 30% 1fr;
  align-items: baseline;
  gap: 2.4cqi;
  padding-bottom: 1cqi;
  border-bottom: 1px dashed rgba(168, 134, 66, 0.4);
  text-align: left;
}

.programme__step:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

/* Clock time, with ព្រឹក / រសៀល beneath it */
.programme__time {
  display: grid;
  font-family: var(--font-khmer-light);
  font-size: clamp(11px, 2.8cqi, 15px);
  line-height: 1.5;
  color: var(--gold-deep);
  text-align: right;
}

.programme__time small {
  font-family: var(--font-khmer);
  font-size: clamp(9px, 2.1cqi, 11.5px);
  line-height: 1.4;
  color: var(--gold-ink);
}

.programme__name {
  display: grid;
  font-family: var(--font-khmer);
  font-size: clamp(11px, 2.8cqi, 15px);
  line-height: 1.55;
  color: var(--ink);
}

.programme__name small {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(9.5px, 2.3cqi, 13px);
  line-height: 1.3;
  color: var(--gold-deep);
}

.inside__closing {
  font-family: var(--font-khmer-display);
  font-size: clamp(11px, 3cqi, 15px);
  color: var(--gold-deep);
}

/* ---------- Left inside page (bilingual detail) ---------- */
.detail-paper :deep(.paper-board__content) {
  gap: 1.2cqi;
  padding: 11cqi 12cqi 9cqi;
}

.detail-paper {
  color: var(--gold-ink);
}

/* Side ornaments sit lower here, beside the English lines where the edges are clear */
.detail-paper :deep(.paper-board__side) {
  top: 70%;
}

.detail__title {
  font-family: var(--font-khmer-display);
  font-weight: 400;
  font-size: clamp(15px, 4.6cqi, 24px);
  line-height: 1.7;
  background: var(--gold-foil-text);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: var(--gold-emboss);
}

.detail__families {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 2cqi;
  width: 100%;
}

.detail__families--en {
  grid-template-columns: 1fr 1fr;
}

/* The invite line sits on its own row, centred below both families */
.detail__families:not(.detail__families--en) {
  grid-template-columns: 1fr 1fr;
}

.detail__invite {
  grid-column: 1 / -1;
  grid-row: 2;
  margin-top: 1.6cqi;
}

.detail__parents {
  display: grid;
  font-family: var(--font-khmer);
  font-size: clamp(10px, 2.3cqi, 12.5px);
  line-height: 1.7;
  text-align: left;
}

.detail__parents:last-child {
  text-align: right;
}

.detail__families--en .detail__parents {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(9.5px, 2.2cqi, 12px);
  line-height: 1.5;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.detail__invite {
  font-family: var(--font-khmer-display);
  font-size: clamp(11px, 2.8cqi, 15px);
  line-height: 1.8;
}

.detail__message {
  font-family: var(--font-khmer);
  font-size: clamp(10px, 2.3cqi, 12.5px);
  line-height: 1.75;
  text-wrap: balance;
}

.detail__couple {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4cqi;
  width: 100%;
}

.detail__couple p {
  display: grid;
}

.detail__label {
  font-family: var(--font-khmer);
  font-size: clamp(9.5px, 2.1cqi, 11.5px);
  line-height: 1.6;
}

.detail__name {
  font-family: var(--font-khmer-display);
  font-size: clamp(13px, 3.6cqi, 19px);
  line-height: 1.7;
  background: var(--gold-foil-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: var(--gold-emboss);
}

/* Gold rule with a centre diamond */
.detail__rule {
  position: relative;
  display: block;
  width: 30cqi;
  height: 1px;
  margin-block: 0.6cqi;
  background: linear-gradient(90deg, transparent, var(--gold) 20%, var(--gold) 80%, transparent);
}

.detail__rule::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1.4cqi;
  height: 1.4cqi;
  min-width: 5px;
  min-height: 5px;
  background: var(--gold);
  translate: -50% -50%;
  rotate: 45deg;
}

.detail__request {
  max-width: 72cqi;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(9px, 2cqi, 11px);
  line-height: 1.5;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-wrap: balance;
}

.detail__script {
  font-family: var(--font-script);
  font-size: clamp(22px, 6.4cqi, 34px);
  line-height: 1.2;
  text-wrap: balance;
  background: var(--gold-foil-text);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: var(--gold-emboss);
}

.nowrap {
  white-space: nowrap;
}

/* Weekday | DD / YYYY | Month */
.detail__date {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 3cqi;
  width: 80%;
}

.detail__date-side {
  padding-block: 0.8cqi;
  border-block: 1px solid var(--gold);
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(9px, 2.1cqi, 11.5px);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.detail__date-day {
  display: grid;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(26px, 8cqi, 42px);
  line-height: 1;
}

.detail__date-day small {
  font-size: clamp(9px, 2.1cqi, 11.5px);
  letter-spacing: 0.2em;
}

.detail__venue {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(9px, 2cqi, 11px);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* ---------- Open / close hint ---------- */
.invitation-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: clamp(1.25rem, 3.5vh, 2.25rem);
  padding: 0.45rem 1.1rem 0.45rem 0.5rem;
  border: 1px solid rgba(168, 134, 66, 0.55);
  border-radius: 999px;
  background: rgba(248, 243, 232, 0.75);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 18px rgba(52, 46, 32, 0.15);
  font-family: var(--font-khmer);
  font-weight: 500;
  font-size: clamp(12px, 0.75rem + 0.2vw, 14px);
  line-height: 1.6;
  color: var(--sage-dark);
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  animation: content-rise 1.2s var(--ease-silk) 2.2s both;
}

.invitation-hint:hover {
  background: var(--ivory);
  box-shadow: 0 8px 22px rgba(52, 46, 32, 0.2);
}

.invitation-hint:focus-visible {
  outline: 2px solid var(--gold-deep);
  outline-offset: 3px;
}

.invitation-hint__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--sage);
  color: var(--gold-light);
}

.invitation-hint__icon svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Pulsing ring invites the first tap */
.invitation-hint__icon::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid var(--gold);
  border-radius: 50%;
  animation: hint-pulse 2.4s ease-out infinite;
}

.is-open .invitation-hint__icon::after {
  animation: none;
  opacity: 0;
}

.invitation-hint__en {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 0.8em;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold-deep);
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

/* A single "lift the cover" hint shortly after load */
@keyframes cover-peek {
  0%, 100% { rotate: var(--peek-rest); }
  35%, 55% { rotate: var(--peek); }
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

@keyframes hint-pulse {
  from { scale: 1; opacity: 0.9; }
  to { scale: 1.7; opacity: 0; }
}

/* Phones and touch screens: keep the gold still to save repaints */
@media (max-width: 767px), (pointer: coarse) {
  .invitation__title {
    animation: content-rise 1.2s var(--ease-silk) 1.1s both;
  }
}

@media (max-width: 767px), (pointer: coarse) {
  @keyframes card-enter {
    from {
      opacity: 0;
      translate: 0 4vh;
      scale: 0.96;
    }
    to {
      opacity: 1;
      translate: 0 0;
      scale: 1;
    }
  }
}

/* ---------- Phones: larger, darker-reading inside pages ----------
   The pages stack on phones, so they can grow taller; on wider screens the open spread
   has to fit the window height, so the sizes above stay as they are. */
@media (max-width: 767px) {
  .detail-paper :deep(.paper-board__content) {
    gap: max(8px, 1.8cqi);
  }

  .detail__title {
    font-size: clamp(17px, 5cqi, 26px);
    margin-bottom: 0.6cqi;
  }

  .detail__parents,
  .detail__message {
    font-size: clamp(11.5px, 2.6cqi, 13.5px);
    line-height: 1.8;
  }

  .detail__families--en .detail__parents {
    font-size: clamp(10.5px, 2.4cqi, 12.5px);
    line-height: 1.55;
  }

  .detail__invite {
    font-size: clamp(12.5px, 3cqi, 16px);
  }

  .detail__label {
    font-size: clamp(10.5px, 2.4cqi, 12.5px);
  }

  .detail__name {
    font-size: clamp(16px, 4.2cqi, 21px);
  }

  .detail__request {
    font-size: clamp(10px, 2.2cqi, 12px);
    line-height: 1.6;
  }

  .detail__script {
    font-size: clamp(26px, 6.8cqi, 36px);
  }

  .detail__date-side,
  .detail__date-day small,
  .detail__venue {
    font-size: clamp(10px, 2.2cqi, 12px);
  }

  .inside__subtitle {
    font-size: clamp(10px, 2.3cqi, 12.5px);
  }

  .programme__day-title span,
  .programme__time,
  .programme__name {
    font-size: clamp(12px, 2.9cqi, 15px);
  }

  .programme__day-title small,
  .programme__name small {
    font-size: clamp(10.5px, 2.4cqi, 13px);
  }

  .programme__time small {
    font-size: clamp(10px, 2.3cqi, 12px);
  }
}

/* ---------- Phones: the cover flips upwards and the pages stack ---------- */
@media (max-width: 767px) {
  .invitation-stage,
  .invitation-stage.is-open {
    --card-w: min(98vw, calc(100vw - 0.5rem), 32rem);
    --peek: x 14deg;
    --peek-rest: x 0deg;
    --peel: rotateX(8deg);
  }

  .invitation-stage {
    --lean-x: 2deg;
    --lean-z: -0.8deg;
    transition: none;
  }

  .invitation-glow,
  .invitation-shadow {
    transition: none;
  }

  .is-open .invitation-glow {
    inset: -10% -25%;
  }

  .is-open .invitation-shadow {
    left: 6%;
    right: 6%;
  }

  .is-open .book {
    translate: none;
  }

  .is-raised .book {
    margin-top: var(--book-h, 140cqi);
  }

  .book__cover {
    transform-origin: center top;
  }

  .is-open .book__cover {
    transform: rotateX(180deg);
  }

  .book__face--back {
    transform: rotateX(180deg);
  }

  .invitation-hint {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    background: rgba(248, 243, 232, 0.92);
  }
}
</style>
