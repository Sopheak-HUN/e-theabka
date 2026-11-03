<script setup lang="ts">
// Closing band: the sage board with the gold monogram, the couple in script, and thanks.
</script>

<template>
  <footer class="wedding-footer">
    <div class="wedding-footer__inner">
      <MonogramCartouche class="wedding-footer__monogram" :groom="wedding.groom.initial" :bride="wedding.bride.initial" />
      <p class="wedding-footer__thanks" lang="km">សូមអរគុណ</p>
      <p class="wedding-footer__couple">{{ wedding.groom.en }} &amp; {{ wedding.bride.en }}</p>
      <p class="wedding-footer__date">
        <time :datetime="wedding.start">{{ wedding.dateEn }}</time>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.wedding-footer {
  position: relative;
  padding: var(--space-xl) var(--space-m) calc(var(--space-xl) + env(safe-area-inset-bottom));
  background:
    var(--tex-paper),
    radial-gradient(120% 140% at 50% 0%, var(--sage-light), var(--sage) 45%, var(--sage-dark) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 -18px 40px -24px rgba(40, 36, 24, 0.5);
}

/* Double gold rule along the top edge, like the foil on the invitation */
.wedding-footer::before {
  content: "";
  position: absolute;
  inset: 0.6rem 0 auto;
  height: 5px;
  border-block: 1px solid rgba(239, 220, 169, 0.7);
}

.wedding-footer__inner {
  display: grid;
  justify-items: center;
  gap: 0.4rem;
  text-align: center;
}

.wedding-footer__monogram {
  width: clamp(5.5rem, 4.5rem + 4vw, 8rem);
  margin-bottom: 0.4rem;
  filter: drop-shadow(0 2px 4px rgba(20, 24, 14, 0.35));
}

.wedding-footer__thanks {
  font-family: var(--font-khmer-display);
  font-size: clamp(1.1rem, 0.9rem + 0.8vw, 1.5rem);
  line-height: 1.8;
  color: var(--gold-light);
}

.wedding-footer__couple {
  font-family: var(--font-script);
  font-size: clamp(1.9rem, 1.4rem + 2vw, 3rem);
  line-height: 1.3;
  color: var(--ivory);
}

.wedding-footer__date {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1rem, 0.95rem + 0.3vw, 1.2rem);
  color: rgba(248, 243, 232, 0.8);
}
</style>
