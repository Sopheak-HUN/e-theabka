<script setup lang="ts">
// The song from app/data/wedding.jsonc ("music"), looping quietly behind the page.
// It tries to start once the page has loaded. Most browsers block sound until the guest
// touches the page, so if that fails it starts on the first tap or key press instead
// (usually opening the card). The one button pauses and plays it.
// Nothing is downloaded up front: the song is several MB and would otherwise compete with
// the invitation for bandwidth on a phone. Playing streams it.
const music = wedding.music

const audio = ref<HTMLAudioElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
const playing = ref(false)
// Hidden if the file fails to load, so a missing song leaves no dead button behind
const failed = ref(false)
// Once the guest pauses, the next tap on the page shouldn't start it again
let pausedByGuest = false
// Paused because the tab went into the background, to resume when it comes back
let pausedByHiding = false

/** Resolves false while the browser still blocks sound, or the file failed */
async function play() {
  if (!audio.value) return false
  try {
    await audio.value.play()
    return true
  } catch {
    return false
  }
}

function toggle() {
  if (!audio.value) return
  removeGestureListeners()
  if (audio.value.paused) {
    pausedByGuest = false
    play()
  } else {
    pausedByGuest = true
    audio.value.pause()
  }
}

function startOnFirstGesture(event: Event) {
  // A first tap on the button itself is left to toggle()
  if (button.value?.contains(event.target as Node)) return
  removeGestureListeners()
  if (!pausedByGuest) play()
}

const gestures = ['pointerdown', 'keydown'] as const
function removeGestureListeners() {
  for (const type of gestures) window.removeEventListener(type, startOnFirstGesture, true)
}

// Silence while the guest has switched to another tab or app
function onVisibilityChange() {
  if (!audio.value) return
  if (document.hidden && !audio.value.paused) {
    pausedByHiding = true
    audio.value.pause()
  } else if (!document.hidden && pausedByHiding) {
    pausedByHiding = false
    play()
  }
}

onMounted(() => {
  if (!audio.value) return
  audio.value.volume = music?.volume ?? 0.5
  for (const type of gestures) window.addEventListener(type, startOnFirstGesture, { capture: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
  // Autoplay where the browser allows it, once the page itself has finished loading;
  // otherwise the first gesture above starts it
  const tryAutoplay = () => {
    if (pausedByGuest || !audio.value?.paused) return
    play().then((started) => started && removeGestureListeners())
  }
  const whenIdle = () => ('requestIdleCallback' in window ? requestIdleCallback(tryAutoplay, { timeout: 2000 }) : setTimeout(tryAutoplay, 500))
  if (document.readyState === 'complete') whenIdle()
  else window.addEventListener('load', whenIdle, { once: true })
})

onBeforeUnmount(() => {
  removeGestureListeners()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div v-if="music?.src" class="background-music">
    <audio
      ref="audio"
      :src="music.src"
      loop
      preload="none"
      @error="failed = true"
      @play="playing = true"
      @pause="playing = false"
    />
    <button
      v-show="!failed"
      ref="button"
      type="button"
      class="background-music__button"
      :class="{ 'is-playing': playing }"
      :aria-pressed="playing"
      :aria-label="playing ? 'Pause music' : 'Play music'"
      :title="music.title"
      @click="toggle"
    >
      <!-- Pause bars while playing, a play triangle while paused -->
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="playing" d="M9 6v12M15 6v12" />
        <path v-else d="M8 5.5v13l10.5-6.5z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.background-music__button {
  position: fixed;
  right: calc(1rem + env(safe-area-inset-right));
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 50;
  display: grid;
  place-items: center;
  width: 2.9rem;
  height: 2.9rem;
  border: 1px solid rgba(239, 220, 169, 0.7);
  border-radius: 50%;
  background: var(--sage);
  box-shadow: 0 6px 18px rgba(52, 46, 32, 0.25), inset 0 0 0 3px rgba(111, 123, 99, 1), inset 0 0 0 4px rgba(239, 220, 169, 0.45);
  color: var(--gold-light);
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.background-music__button:hover {
  background: var(--sage-dark);
}

.background-music__button:focus-visible {
  outline: 2px solid var(--gold-deep);
  outline-offset: 3px;
}

.background-music__button svg {
  width: 1.2rem;
  height: 1.2rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.background-music__button:not(.is-playing) svg {
  fill: currentColor;
}

.background-music__button.is-playing svg {
  stroke-width: 2.6;
}
</style>
