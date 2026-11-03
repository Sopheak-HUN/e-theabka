<script setup lang="ts">
// Link previews (Telegram, Messenger, Facebook) read these from the server-rendered HTML,
// so a link with ?to=Guest%20Name previews with that guest's name.
const guest = useRequestURL().searchParams.get('to') ?? ''
const couple = `${wedding.groom.en} & ${wedding.bride.en}`
const title = guest ? `សូមគោរពអញ្ជើញ ${guest}` : `សិរីមង្គលអាពាហ៍ពិពាហ៍ ${couple}`
const description = `${guest ? `${guest}, you are invited to the wedding of ${couple}` : `The wedding of ${couple}`}. ${wedding.dateEn}, ${wedding.timeEn}, ${wedding.venue.en}.`

useSeoMeta({
  ogType: 'website',
  ogLocale: 'km_KH',
  ogTitle: title,
  ogDescription: description,
  ogSiteName: couple,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
  description,
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <main>
      <WeddingHero />
      <!-- The table continues below the hero; each section is another piece of the suite -->
      <div class="wedding-table">
        <CountdownSection />
        <GallerySection />
        <VenueSection />
        <GiftSection />
      </div>
    </main>
    <WeddingFooter />
  </div>
</template>

<style>
/* Same linen cloth and light as the hero's table, carried down the page */
.wedding-table {
  position: relative;
  isolation: isolate;
  overflow: clip;
  background:
    radial-gradient(70% 40% at 50% 0%, rgba(255, 255, 250, 0.55), transparent 70%),
    linear-gradient(#E6DDCC, #EAE1D0 40%, #E3D8C4);
}

.wedding-table::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--tex-linen);
  mix-blend-mode: multiply;
  opacity: 0.12;
  pointer-events: none;
}

/* Kbach phka chan, fading in from the hero above */
.wedding-table::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--tex-kbach) center top / 180px;
  opacity: 0.26;
  -webkit-mask: linear-gradient(transparent, #000 14rem);
  mask: linear-gradient(transparent, #000 14rem);
  pointer-events: none;
}

@media (max-width: 767px) {
  .wedding-table::after {
    background-size: 140px;
    opacity: 0.2;
  }

  .wedding-table::before {
    mix-blend-mode: normal;
    opacity: 0.06;
  }
}
</style>
