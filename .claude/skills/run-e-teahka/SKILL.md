---
name: run-e-teahka
description: Run, start, build, and drive the e-teahka Nuxt wedding invitation app. Use when asked to launch the dev server, screenshot the invitation (closed or opened, desktop or mobile), click through the open/close book animation, check a ?to= guest name, or confirm a UI change works in the real browser.
---

e-teahka is a single-page Nuxt 4 site: a Khmer wedding invitation that opens like a
book. An agent drives it by starting the Nuxt server, then running
`.claude/skills/run-e-teahka/driver.mjs` (Playwright, headless Chromium), which
loads the page, screenshots it closed, clicks "Tap to open", screenshots the
open book, presses Escape, and reports console errors.

All paths are relative to the repo root.

## Prerequisites

Node 24 (nvm) is what was used. Headless Chromium needs these system libs on
Ubuntu 24.04 (without them launch dies with `libnspr4.so: cannot open shared object file`):

```bash
sudo apt-get update
sudo apt-get install -y --no-install-recommends libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64 libatspi2.0-0t64 libcairo2 libcups2t64 libdbus-1-3 libdrm2 libgbm1 libglib2.0-0t64 libnspr4 libnss3 libpango-1.0-0 libx11-6 libxcb1 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxkbcommon0 libxrandr2 fonts-noto-color-emoji libfontconfig1 libfreetype6 fonts-liberation
```

## Setup

```bash
npm install                                          # app deps (runs nuxt prepare)
npm install --prefix .claude/skills/run-e-teahka     # driver deps: playwright 1.55.0 only
npx --prefix .claude/skills/run-e-teahka playwright install --only-shell chromium   # no-op if already cached
```

Playwright lives in the skill's own `package.json` so the app's dependencies
stay untouched. It is pinned to 1.55.0 because that matches the
`chromium_headless_shell-1187` browser build.

## Run (agent path)

1. Make sure a server is up. Check first, because one may already be running:

```bash
curl -sf -o /dev/null http://localhost:3000 && echo up || {
  (npm run dev > /tmp/e-teahka-dev.log 2>&1 &)
  timeout 90 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
}
```

Cold start takes about 6 seconds.

2. Drive it:

```bash
node .claude/skills/run-e-teahka/driver.mjs --to="Mr. Test Guest"
```

The expected output ends with `console errors: none`, and the exit code is 0.
Screenshots go to `/tmp/e-teahka-shots/`:
`desktop-closed.png`, `desktop-open.png`, `desktop-closed-again.png`
(the prefix is `mobile-` when you pass `--mobile`). **Open the PNGs and look at them.**

| flag | effect |
|---|---|
| `--url=http://localhost:3100` | target another server (default `$BASE_URL` or `:3000`) |
| `--to="Name"` | adds `?to=` and asserts that the cover's guest box shows it |
| `--mobile` | iPhone 13 emulation (390×844 @3x, touch, no tilt) |
| `--full` | full-page screenshots (needed on mobile, where the open book's pages stack and scroll) |
| `--reduced-motion` | `prefers-reduced-motion: reduce`, so the animations are instant (faster and deterministic) |
| `--eval="<js>"` | evaluate JS in the page while the book is open and print the result, e.g. `--eval="document.querySelectorAll('.programme__step').length"` → `5` |
| `--out=<dir>` | screenshot directory |

Verified variants:

```bash
node .claude/skills/run-e-teahka/driver.mjs --mobile --full --reduced-motion --out=/tmp/e-teahka-shots/full
node .claude/skills/run-e-teahka/driver.mjs --reduced-motion --eval="document.querySelectorAll('.programme__step').length"
```

Stop a server you started: `lsof -ti:3000 -sTCP:LISTEN | xargs -r kill`.
Do not kill a server the user started in their terminal.

## Production build

```bash
npm run build
(PORT=3200 node .output/server/index.mjs > /tmp/e-teahka-prod.log 2>&1 &)
timeout 30 bash -c 'until curl -sf http://localhost:3200 >/dev/null; do sleep 1; done'
node .claude/skills/run-e-teahka/driver.mjs --url=http://localhost:3200 --out=/tmp/e-teahka-shots/prod
lsof -ti:3200 -sTCP:LISTEN | xargs -r kill
```

The build takes about 8 seconds. It logs an og-image `WARN` that is harmless.

## Run (human path)

`npm run dev` serves http://localhost:3000. Open it in a browser and press Ctrl-C to stop.

## Test

There is no test suite. The driver's exit code (open/close flow plus zero console
errors) is the check.

## Gotchas

- **Nuxt 4 allows only one dev server per project dir.** If someone (usually the
  user, in their own terminal) already runs `nuxt dev`, a second `npm run dev`
  does *not* fail and does *not* pick another port. It prints
  `Another Nuxt dev server is already running ... Pass --takeover` and exits.
  Just point the driver at the existing `:3000`; it hot-reloads your edits.
  `--takeover` kills their server, so don't use it unless asked. To get an
  isolated server, rsync the repo (excluding `node_modules .nuxt .output .data .git`)
  to a scratch dir, symlink `node_modules`, and run `npx nuxt dev --port 3100` there.
- **The book only mounts its inside pages after the first open** (`hasOpened`).
  `#invitation-inside` and the rose detail page are absent from the DOM until the
  hint button has been clicked once, so selectors for inside content fail on a fresh load.
- **The animations are long.** The cover flip duration is the `--dur-book` CSS var on
  `.invitation-stage`. The driver reads it and waits that long plus 800 ms. Without
  that wait, screenshots catch the cover mid-flip. On phones the card also raises and
  glides, so `--reduced-motion` is the fastest way to get stable shots.
- **Fonts come from Google Fonts** (Moul, Noto Serif Khmer, Pinyon Script...).
  Offline, the Khmer text renders in fallback fonts and looks wrong. The driver
  waits on `document.fonts.ready` before the first shot.
- **The dev screenshots include the Nuxt DevTools pill** (bottom centre, "669 ms").
  It comes from `devtools: { enabled: true }`. Production-build shots don't have it.
- **The guest name is read from the URL during SSR** (`useRequestURL()`), so
  `?to=` must be in the URL you load. Setting it client-side afterwards does nothing.
- **Measuring animation smoothness: Playwright's `click()` scrolls the target into
  view first.** On mobile the Close button sits below both stacked pages, so a bare
  `hint.click()` adds a ~550 px scroll in the same frame as the close and looks like
  a huge jump. Call `hint.scrollIntoViewIfNeeded()`, wait ~600 ms, then click. Log
  `scrollY` and the book's position per `requestAnimationFrame`. Use mobile emulation
  for frame timing; desktop runs here are software-rendered and too noisy to compare.
- **Sections below the hero (countdown, gallery, venue, gift, footer) need scrolling
  before you screenshot them.** The gallery prints stay hidden until an
  IntersectionObserver sees them, and the map iframe is `loading="lazy"`. Scroll with
  `page.mouse.wheel` in steps, or use `locator('#gallery').scrollIntoViewIfNeeded()`
  and wait about 2 s. Then take `locator('#venue').screenshot(...)`. Section ids are
  `countdown`, `gallery`, `venue` and `gift`.
- **`fullPage: true` on desktop squashes the hero card into a thin column.** The
  capture resizes the viewport, and the card's width depends on `100svh`. It looks
  fine at a real viewport size, so take the hero and the sections as separate shots.
- **The pointer tilt is disabled under emulation/touch and reduced motion**
  (`canTilt` needs `hover: hover` + `pointer: fine`). The tilt only shows in
  desktop, no-reduced-motion runs.

## Troubleshooting

- **`browserType.launch: ... libnspr4.so: cannot open shared object file`**:
  Chromium's system libs are missing. Run the apt-get line in Prerequisites.
- **`npm run dev` exits immediately with "Another Nuxt dev server is already running"**:
  see the first gotcha. Use the existing server.
