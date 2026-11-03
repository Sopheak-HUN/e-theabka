#!/usr/bin/env node
// Drive the wedding invitation in headless Chromium: load, screenshot closed,
// open the book, screenshot open, close it again, report console errors.
//
//   node driver.mjs [--url=http://localhost:3000] [--to="Guest Name"]
//                   [--mobile] [--reduced-motion] [--out=/tmp/e-teahka-shots]
//                   [--full] [--eval="document.title"]
//
// Exits non-zero if the open/close flow fails or the page logs errors.
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, '').split('=')
    return [k, v.length ? v.join('=') : true]
  }),
)
const base = args.url ?? process.env.BASE_URL ?? 'http://localhost:3000'
const out = args.out ?? '/tmp/e-teahka-shots'
const tag = args.mobile ? 'mobile' : 'desktop'
mkdirSync(out, { recursive: true })

const url = new URL(base)
if (args.to) url.searchParams.set('to', args.to)

const browser = await chromium.launch()
const context = await browser.newContext({
  ...(args.mobile ? devices['iPhone 13'] : { viewport: { width: 1280, height: 900 } }),
  reducedMotion: args['reduced-motion'] ? 'reduce' : 'no-preference',
})
const page = await context.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

const stage = page.locator('.invitation-stage')
const hint = page.locator('button.invitation-hint')
// --dur-book is the cover flip time; wait for it plus the raise/glide on phones.
const settle = async () => {
  const ms = await stage.evaluate((el) =>
    matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : parseFloat(getComputedStyle(el).getPropertyValue('--dur-book')) * 1000,
  )
  await page.waitForTimeout(ms + 800)
}
const shot = async (name) => {
  const path = `${out}/${tag}-${name}.png`
  await page.screenshot({ path, fullPage: !!args.full })
  console.log('screenshot', path)
}

let ok = true
try {
  await page.goto(url.href, { waitUntil: 'networkidle' })
  await hint.waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1500) // cover-item entrance stagger
  if (args.to) {
    const name = await page.locator('.invitation__guest-name').textContent()
    console.log('guest box:', JSON.stringify(name))
    if (name?.trim() !== args.to) ok = false
  }
  await shot('closed')

  await hint.click()
  await page.waitForSelector('.invitation-stage.is-open')
  await settle()
  console.log('aria-expanded after open:', await hint.getAttribute('aria-expanded'))
  console.log('inside visible:', await page.locator('#invitation-inside').isVisible())
  await shot('open')

  if (args.eval) console.log('eval:', JSON.stringify(await page.evaluate(args.eval)))

  await page.keyboard.press('Escape')
  await page.waitForSelector('.invitation-stage:not(.is-open)')
  await settle()
  console.log('aria-expanded after Escape:', await hint.getAttribute('aria-expanded'))
  await shot('closed-again')
} catch (e) {
  ok = false
  console.error('FLOW FAILED:', e.message)
  await shot('failure').catch(() => {})
}

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
process.exit(ok && !errors.length ? 0 : 1)
