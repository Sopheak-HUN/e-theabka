<script setup lang="ts">
// Wedding gift (ចំណងដៃ): one card with the bank QR and a copyable account number.
const gift = wedding.gift
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  if (!gift) return
  try {
    await navigator.clipboard.writeText(gift.account.replace(/\s/g, ''))
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard blocked (e.g. not https): the number is still on the card to copy by hand
  }
}
onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <WeddingSection v-if="gift" id="gift" title-km="ចំណងដៃ" title-en="A gift, should you wish" reveal-content>
    <p class="gift__note" lang="km">
      វត្តមានរបស់លោកអ្នក គឺជាកាដូដ៏មានតម្លៃបំផុតសម្រាប់យើងខ្ញុំ។
      សម្រាប់ភ្ញៀវកិត្តិយសដែលមិនអាចអញ្ជើញមកដល់ ឬប្រាថ្នាផ្ញើចំណងដៃ អាចផ្ញើតាមគណនីខាងក្រោម។
    </p>

    <div class="gift__card">
      <InvitationPaper class="gift__paper" :sides="false">
        <header class="gift__heading">
          <h3 lang="km">ស្កេនដើម្បីផ្ញើ</h3>
          <p>Scan to send</p>
        </header>

        <div class="gift__qr">
          <img v-if="gift.qr" :src="gift.qr" :alt="`${gift.bank} QR code for ${gift.name}`" loading="lazy">
          <span v-else class="gift__qr-placeholder">KHQR</span>
        </div>

        <dl class="gift__account">
          <dt class="visually-hidden">Account name</dt>
          <dd class="gift__name">{{ gift.name }}</dd>
          <dt class="visually-hidden">Bank</dt>
          <dd class="gift__bank">{{ gift.bank }}</dd>
          <dt class="visually-hidden">Account number</dt>
          <dd class="gift__number selectable">{{ gift.account }}</dd>
        </dl>

        <button type="button" class="wedding-button" @click="copy">
          <span class="wedding-button__icon" aria-hidden="true">
            <svg v-if="copied" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            <svg v-else viewBox="0 0 24 24">
              <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" />
              <path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
            </svg>
          </span>
          <span lang="km">{{ copied ? 'បានចម្លង' : 'ចម្លងលេខគណនី' }}</span>
          <span class="wedding-button__en" aria-live="polite">{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>
      </InvitationPaper>
    </div>
  </WeddingSection>
</template>

<style scoped>
.gift__note {
  max-width: 36rem;
  margin: 0 auto var(--space-l);
  font-family: var(--font-khmer);
  font-size: clamp(0.85rem, 0.8rem + 0.25vw, 1rem);
  line-height: 1.9;
  color: var(--ink);
  text-align: center;
  text-wrap: balance;
}

/* The paper sizes itself from this container */
.gift__card {
  container-type: inline-size;
  display: flex;
  width: min(22rem, 100%);
  margin-inline: auto;
  rotate: -1deg;
}

.gift__paper :deep(.paper-board__content) {
  justify-content: center;
  gap: 4cqi;
  padding: 14cqi 13cqi 12cqi;
}

.gift__heading {
  display: grid;
}

.gift__heading h3 {
  font-family: var(--font-khmer-display);
  font-weight: 400;
  font-size: clamp(14px, 5.4cqi, 22px);
  line-height: 1.8;
  background: var(--gold-foil-text);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: var(--gold-emboss);
}

.gift__heading p {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(13px, 4cqi, 17px);
  color: var(--gold-deep);
}

.gift__qr {
  width: 56cqi;
  aspect-ratio: 1;
  padding: 2.4cqi;
  border: 1px solid rgba(168, 134, 66, 0.6);
  border-radius: 2px;
  background: #FFFDF7;
  box-shadow: inset 0 0 0 1.4cqi #FFFDF7, inset 0 0 0 calc(1.4cqi + 1px) rgba(201, 164, 92, 0.45);
}

.gift__qr img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.gift__qr-placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(168, 134, 66, 0.55);
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(12px, 4cqi, 16px);
  letter-spacing: 0.2em;
  color: var(--gold-deep);
}

.gift__account {
  display: grid;
  gap: 0.6cqi;
}

.gift__name {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(12px, 3.8cqi, 16px);
  letter-spacing: 0.12em;
  color: var(--ink);
  text-wrap: balance;
}

.gift__bank {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(12px, 3.8cqi, 15px);
  color: var(--gold-deep);
}

.gift__number {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(16px, 6cqi, 24px);
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
  color: var(--gold-ink);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 767px) {
  .gift__card {
    rotate: none;
  }
}
</style>
