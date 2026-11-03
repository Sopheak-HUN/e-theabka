<script setup lang="ts">
// The link-preview card (og:image): the sage board and gold frame of the footer, the couple
// in script, the date, and the guest's name when the link carries ?to=Guest%20Name.
import { wedding } from '~/utils/wedding'

const { guest = '' } = defineProps<{ guest?: string }>()
const { groom, bride, dateKm, dateEn, timeEn, venue } = wedding
</script>

<template>
  <div
    class="w-full h-full flex items-center justify-center p-[28px]"
    style="background: radial-gradient(120% 140% at 50% 0%, #8E987F, #6F7B63 45%, #55604B 100%)"
  >
    <!-- Double gold rule, like the foil on the invitation -->
    <div class="w-full h-full flex p-[8px] border-solid border-[2px]" style="border-color: rgba(239, 220, 169, 0.8)">
      <div
        class="w-full h-full flex flex-col items-center justify-center border-solid border-[1px] text-center"
        style="border-color: rgba(239, 220, 169, 0.55); color: #EFDCA9"
      >
        <p class="m-0 text-[34px] leading-[1.9]" style="font-family: Moul">
          សិរីមង្គលអាពាហ៍ពិពាហ៍
        </p>

        <p class="m-0 mt-[6px] text-[92px] leading-[1.15]" style="font-family: 'Pinyon Script'; color: #F8F3E8">
          {{ groom.en }} &amp; {{ bride.en }}
        </p>

        <p class="m-0 mt-[4px] text-[30px] leading-[1.8]" style="font-family: 'Noto Serif Khmer'">
          {{ groom.km }} · {{ bride.km }}
        </p>

        <div class="flex mt-[14px] w-[360px] h-[1px]" style="background: rgba(239, 220, 169, 0.7)" />

        <p class="m-0 mt-[16px] text-[26px] leading-[1.8]" style="font-family: 'Noto Serif Khmer'">
          {{ dateKm }}
        </p>
        <p class="m-0 text-[26px] tracking-[0.06em]" style="font-family: 'Cormorant Garamond'; color: #F8F3E8">
          {{ dateEn }} · {{ timeEn }} · {{ venue.en }}
        </p>

        <p
          v-if="guest"
          class="m-0 mt-[22px] px-[30px] py-[6px] text-[28px] leading-[1.8] rounded-full"
          style="font-family: 'Noto Serif Khmer'; background: rgba(16, 42, 34, 0.35); color: #F8F3E8"
        >
          សូមគោរពអញ្ជើញ {{ guest }}
        </p>
      </div>
    </div>
  </div>
</template>
