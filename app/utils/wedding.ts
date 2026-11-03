// Loads the wedding details from app/data/wedding.jsonc. Edit the text there, not here.
import source from '~/data/wedding.jsonc?raw'

export interface GalleryPhoto {
  /** Path under /public, e.g. '/gallery/01.jpg'. Leave empty to show a placeholder print. */
  src?: string
  alt: string
  caption: string
  /** Shape of the print. */
  shape: 'portrait' | 'landscape' | 'square'
}

export interface GiftAccount {
  name: string
  bank: string
  account: string
  /** Path under /public to the bank's KHQR image. Leave empty for a placeholder. */
  qr?: string
}

export interface ProgrammeDay {
  dayKm: string
  dayEn: string
  steps: { time: string; period: string; km: string; en: string }[]
}

interface Person {
  km: string
  en: string
  initial: string
}

export interface WeddingDetails {
  groom: Person
  bride: Person
  start: string
  end: string
  dateKm: string
  dateEn: string
  timeKm: string
  timeEn: string
  venue: { km: string; en: string; addressKm: string; addressEn: string; mapQuery: string }
  programme: ProgrammeDay[]
  gallery: GalleryPhoto[]
  gift?: GiftAccount
}

// JSON with // and /* */ comments and trailing commas. Strings are copied as-is,
// so a "//" inside a URL or a ",]" inside text is left alone.
function parseJsonc(text: string): unknown {
  let out = ''
  let i = 0
  while (i < text.length) {
    const c = text[i]!
    const next = text[i + 1]
    if (c === '"') {
      let j = i + 1
      while (j < text.length && text[j] !== '"') j += text[j] === '\\' ? 2 : 1
      out += text.slice(i, j + 1)
      i = j + 1
    } else if (c === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') i++
    } else if (c === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2)
      i = end < 0 ? text.length : end + 2
    } else {
      // A comma right before a closing bracket is a trailing comma
      if (c === '}' || c === ']') out = out.replace(/,\s*$/, '')
      out += c
      i++
    }
  }
  return JSON.parse(out)
}

export const wedding = parseJsonc(source) as WeddingDetails

const khmerDigits = '០១២៣៤៥៦៧៨៩'

/** 12 -> '១២' */
export const toKhmerDigits = (value: number | string) =>
  String(value).replace(/\d/g, (d) => khmerDigits[Number(d)]!)
