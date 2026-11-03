<script setup lang="ts">
// Venue card (the invitation's paper, standing upright) beside a map held like a print.
const { venue } = wedding
const query = encodeURIComponent(venue.mapQuery)

const mapEmbed = `https://maps.google.com/maps?q=${query}&z=15&output=embed`
const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}`

// Google Calendar wants UTC as 20270117T100000Z
const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const calendar = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
  action: 'TEMPLATE',
  text: `Wedding of ${wedding.groom.en} & ${wedding.bride.en}`,
  dates: `${utc(wedding.start)}/${utc(wedding.end)}`,
  location: `${venue.en}, ${venue.addressEn}`,
}).toString()

const { weekday, day, month, year } = weddingDate
</script>

<template>
  <WeddingSection id="venue" title-km="ទីតាំងកម្មវិធី" title-en="Where we will celebrate" reveal-content>
    <div class="venue">
      <div class="venue__card">
        <InvitationPaper class="venue__paper">
          <p class="venue__lead" lang="km">ប្រារព្ធនៅ</p>
          <div class="venue__names">
            <p class="venue__name" lang="km">{{ venue.km }}</p>
            <p class="venue__name-en">{{ venue.en }}</p>
          </div>

          <address class="venue__address">
            <span lang="km">{{ venue.addressKm }}</span>
            <span>{{ venue.addressEn }}</span>
          </address>

          <span class="venue__rule" aria-hidden="true" />

          <time class="venue__date" :datetime="wedding.start">
            <span class="venue__date-side">{{ weekday }}</span>
            <span class="venue__date-day">
              {{ day }}
              <small>{{ year }}</small>
            </span>
            <span class="venue__date-side">{{ month }}</span>
          </time>
          <p class="venue__time" lang="km">{{ wedding.timeKm }}</p>

          <div class="venue__actions">
            <a class="wedding-button" :href="directions" target="_blank" rel="noopener">
              <span class="wedding-button__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
              </span>
              <span lang="km">បង្ហាញផ្លូវ</span>
              <span class="wedding-button__en">Directions</span>
            </a>
            <a class="wedding-button" :href="calendar" target="_blank" rel="noopener">
              <span class="wedding-button__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="5.5" width="16" height="14.5" rx="1.5" />
                  <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
                </svg>
              </span>
              <span lang="km">កត់ចំណាំថ្ងៃ</span>
              <span class="wedding-button__en">Save the date</span>
            </a>
          </div>
        </InvitationPaper>
      </div>

      <figure class="venue__map">
        <div class="venue__map-frame">
          <iframe
            :src="mapEmbed"
            :title="`Map: ${venue.en}`"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
          <span class="venue__corner venue__corner--tl" aria-hidden="true" />
          <span class="venue__corner venue__corner--tr" aria-hidden="true" />
          <span class="venue__corner venue__corner--bl" aria-hidden="true" />
          <span class="venue__corner venue__corner--br" aria-hidden="true" />
        </div>
        <figcaption class="venue__map-caption">{{ venue.en }}</figcaption>
      </figure>
    </div>
  </WeddingSection>
</template>

<style scoped>
.venue {
  display: grid;
  grid-template-columns: minmax(0, 26rem) minmax(0, 1fr);
  align-items: center;
  justify-content: center;
  gap: clamp(1.5rem, 1rem + 3vw, 4rem);
}

/* The paper sizes itself from this container, like the invitation stage */
.venue__card {
  container-type: inline-size;
  display: flex;
  rotate: -1.5deg;
}

.venue__paper :deep(.paper-board__content) {
  justify-content: center;
  gap: 3.2cqi;
}

.venue__lead {
  font-family: var(--font-khmer-display);
  font-size: clamp(11px, 3cqi, 15px);
  line-height: 1.8;
  color: var(--gold-deep);
}

.venue__names {
  display: grid;
  gap: 1cqi;
}

.venue__name {
  font-family: var(--font-khmer-display);
  font-size: clamp(15px, 5cqi, 24px);
  line-height: 1.8;
  background: var(--gold-foil-text);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: var(--gold-emboss);
  text-wrap: balance;
}

.venue__name-en {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(11px, 3cqi, 15px);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold-ink);
}

.venue__address {
  display: grid;
  font-style: normal;
  font-family: var(--font-khmer);
  font-size: clamp(11px, 2.8cqi, 14px);
  line-height: 1.7;
  color: var(--ink);
}

.venue__address span:last-child {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.1em;
  color: var(--gold-deep);
}

.venue__rule {
  position: relative;
  display: block;
  width: 30cqi;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold) 20%, var(--gold) 80%, transparent);
}

.venue__rule::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 5px;
  height: 5px;
  background: var(--gold);
  translate: -50% -50%;
  rotate: 45deg;
}

/* Weekday | DD / YYYY | Month, as inside the invitation */
.venue__date {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 3cqi;
  width: 82%;
  color: var(--gold-ink);
}

.venue__date-side {
  padding-block: 0.8cqi;
  border-block: 1px solid var(--gold);
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(9px, 2.3cqi, 12px);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.venue__date-day {
  display: grid;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(28px, 9cqi, 46px);
  line-height: 1;
}

.venue__date-day small {
  font-size: clamp(9px, 2.3cqi, 12px);
  letter-spacing: 0.2em;
}

.venue__time {
  font-family: var(--font-khmer-light);
  font-size: clamp(11px, 2.9cqi, 15px);
  line-height: 1.8;
  color: var(--gold-deep);
}

.venue__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2cqi;
  margin-top: 1cqi;
}

/* ---------- Map print ---------- */
.venue__map {
  padding: 0.7rem 0.7rem 0;
  border-radius: 2px;
  background:
    var(--tex-paper),
    linear-gradient(170deg, #FFFDF7, var(--ivory) 60%, #EFE7D7);
  box-shadow:
    0 1px 2px rgba(40, 36, 24, 0.22),
    0 12px 26px -6px rgba(40, 36, 24, 0.3),
    0 34px 60px -26px rgba(40, 36, 24, 0.42);
  rotate: 1.2deg;
}

.venue__map-frame {
  position: relative;
  aspect-ratio: 1;
  background: #DCCFB8;
}

/* Soften Google's colours towards the paper palette */
.venue__map-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  filter: sepia(0.35) saturate(0.8) contrast(0.95);
}

.venue__corner {
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--gold-foil);
  background-size: 300% 300%;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  filter: drop-shadow(0 1px 1px rgba(60, 44, 16, 0.35));
  pointer-events: none;
}

.venue__corner--tl { top: 0; left: 0; }
.venue__corner--tr { top: 0; right: 0; scale: -1 1; }
.venue__corner--bl { bottom: 0; left: 0; scale: 1 -1; }
.venue__corner--br { bottom: 0; right: 0; scale: -1 -1; }

.venue__map-caption {
  padding: 0.6rem 0 0.8rem;
  font-family: var(--font-script);
  font-size: clamp(1.2rem, 1rem + 0.7vw, 1.6rem);
  color: var(--gold-ink);
  text-align: center;
}

@media (max-width: 767px) {
  .venue {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }

  .venue__card {
    width: min(26rem, 100%);
    rotate: none;
  }

  .venue__map {
    width: min(26rem, 100%);
    rotate: none;
  }
}
</style>
