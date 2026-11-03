<script setup lang="ts">
// One stop along the table below the hero: a gold-foil Khmer title, an English
// line in italic, the diamond rule from the invitation, then the section content.
defineProps<{ id: string; titleKm: string; titleEn: string }>()
</script>

<template>
  <section :id="id" class="wedding-section" :aria-labelledby="`${id}-title`">
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
  background: var(--gold-foil);
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
