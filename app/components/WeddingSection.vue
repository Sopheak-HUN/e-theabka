<script setup lang="ts">
// One stop along the table below the hero: a gold-foil Khmer title, an English
// line in italic, the diamond rule from the invitation, then the section content.
// The header (and with reveal-content, the content too) rises into place with GSAP the
// first time the section scrolls into view.
import { gsap } from 'gsap'

const { revealContent = false } = defineProps<{
  id: string
  titleKm: string
  titleEn: string
  /** Also reveal the content; off for sections with their own entrance (countdown, gallery) */
  revealContent?: boolean
}>()

const section = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const el = section.value
  if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // Already on screen at load (a reload part-way down): leave it as is, no flash
  if (el.getBoundingClientRect().top < window.innerHeight) return

  const header = [...el.querySelectorAll('.wedding-section__header > *')]
  const content = revealContent ? [...el.children].filter((child) => child.tagName !== 'HEADER') : []
  gsap.set([...header, ...content], { autoAlpha: 0, y: 24 })

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      observer?.disconnect()
      gsap
        .timeline({ defaults: { duration: 1, ease: 'power3.out' } })
        .to(header, { autoAlpha: 1, y: 0, stagger: 0.12, clearProps: 'all' })
        .to(content, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.15, clearProps: 'all' }, '-=0.6')
    },
    { rootMargin: '0px 0px -15% 0px' },
  )
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section :id="id" ref="section" class="wedding-section" :aria-labelledby="`${id}-title`">
    <header class="wedding-section__header">
      <h2 :id="`${id}-title`" class="wedding-section__title" lang="km">{{ titleKm }}</h2>
      <p class="wedding-section__subtitle">{{ titleEn }}</p>
      <span class="wedding-section__rule" aria-hidden="true" />
    </header>
    <slot />
  </section>
</template>

<style scoped>
.wedding-section {
  width: min(68rem, 100%);
  margin-inline: auto;
  padding: var(--space-xl) var(--space-m);
  /* Off-screen sections skip layout and paint. Opening the card on a phone makes room above
     it, which otherwise re-lays out every section below in the first frame of the flip.
     "auto" remembers each section's real height once it has been seen. */
  content-visibility: auto;
  contain-intrinsic-size: auto 40rem;
}

.wedding-section__header {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  margin-bottom: var(--space-l);
  text-align: center;
}

.wedding-section__title {
  font-family: var(--font-khmer-display);
  font-weight: 400;
  font-size: clamp(1.35rem, 1rem + 1.6vw, 2.1rem);
  line-height: 1.8;
  background: var(--gold-foil-text);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: var(--gold-emboss);
}

.wedding-section__subtitle {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.05rem, 0.95rem + 0.4vw, 1.3rem);
  color: var(--sage-dark);
}

/* Gold rule with a centre diamond, as inside the invitation */
.wedding-section__rule {
  position: relative;
  display: block;
  width: 9rem;
  height: 1px;
  margin-top: 0.6rem;
  background: linear-gradient(90deg, transparent, var(--gold) 20%, var(--gold) 80%, transparent);
}

.wedding-section__rule::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 6px;
  background: var(--gold);
  translate: -50% -50%;
  rotate: 45deg;
}
</style>
