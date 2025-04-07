<script setup lang="ts">
import { ref, reactive } from 'vue'

export interface PricingTierFrequency {
  id: string
  value: string
  label: string
  priceSuffix: string
}

export interface PricingTier {
  name: string
  id: string
  href: string
  price: string | Record<string, string>
  description: string
  features: string[]
  featured?: boolean
  highlighted?: boolean
  cta: string
  soldOut?: boolean
}

const pricingFrequencies: PricingTierFrequency[] = [
  { id: '1', value: '1', label: 'Monthly', priceSuffix: '/month' },
  { id: '2', value: '2', label: 'Annually', priceSuffix: '/year' },
]

const pricingTiers: PricingTier[] = [
  {
    name: 'Regular',
    id: '0',
    href: '/profile',
    price: { '1': '$20', '2': '$200' },
    description: `Maximum 10 pages per batch and 1 batch per day.`,
    features: ['10 pages per batch', '1 batch per day'],
    featured: false,
    highlighted: false,
    soldOut: false,
    cta: `Sign up`,
  },
  {
    name: 'Pro',
    id: '1',
    href: '/profile',
    price: { '1': '$50', '2': '$500' },
    description: `When you grow, need more power and flexibility.`,
    features: ['100 pages per batch', '10 batches per day'],
    featured: false,
    highlighted: true,
    soldOut: false,
    cta: `Get started`,
  },
  {
    name: 'Enterprise',
    id: '2',
    href: '/contact',
    price: { '1': 'Custom', '2': 'Custom' },
    description: `Tailored solutions for enterprise-level needs.`,
    features: ['Flexible pages per batch', 'Custom batch limits & usage'],
    featured: true,
    highlighted: false,
    soldOut: false,
    cta: `Get started`,
  },
]

const frequencies = reactive(pricingFrequencies)
const tiers = reactive(pricingTiers)
const frequency = ref(frequencies[0])
const bannerText = ref('')

const setFrequency = (option: PricingTierFrequency) => {
  frequency.value = option
}
</script>
<template>
  <div class="flex flex-col w-full items-center fancyOverlay">
    <div class="w-full flex flex-col items-center">
      <div class="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
        <div class="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
          <h1
            class="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight"
          >
            Our Pricing Plans
          </h1>
          <p>Choose the plan that best fits your needs.</p>
        </div>

        <div
          v-if="bannerText"
          class="w-full lg:w-auto flex justify-center my-4"
        >
          <p
            class="w-full px-4 py-3 text-xs bg-slate-100 text-black dark:bg-slate-300/30 dark:text-white/80 rounded-xl"
          >
            {{ bannerText }}
          </p>
        </div>

        <div v-if="frequencies.length > 1" class="mt-16 flex justify-center">
          <div
            role="radiogroup"
            class="grid gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-white dark:bg-black ring-1 ring-inset ring-gray-200/30 dark:ring-gray-800"
            :style="{
              gridTemplateColumns: `repeat(${frequencies.length}, minmax(0, 1fr))`,
            }"
          >
            <p class="sr-only">Payment frequency</p>
            <label
              v-for="option in frequencies"
              :key="option.value"
              :class="[
                frequency.value === option.value
                  ? 'bg-slate-500/90 text-white dark:bg-slate-900/70 dark:text-white/70'
                  : 'bg-transparent text-gray-500 hover:bg-slate-500/10',
                'cursor-pointer rounded-full px-2.5 py-2 transition-all',
              ]"
              :for="option.value"
            >
              {{ option.label }}
              <input
                type="radio"
                :value="option.value"
                :id="option.value"
                v-model="frequency.value"
                @click="setFrequency(option)"
                class="hidden"
                :aria-checked="frequency.value === option.value"
              />
            </label>
          </div>
        </div>

        <div
          :class="[
            'isolate mx-auto mt-4 mb-28 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none select-none',
            tiers.length === 2 ? 'lg:grid-cols-2' : '',
            tiers.length === 3 ? 'lg:grid-cols-3' : '',
          ]"
        >
          <div
            v-for="tier in tiers"
            :key="tier.id"
            :class="[
              tier.featured
                ? '!bg-gray-900 ring-gray-900 dark:!bg-gray-100 dark:ring-gray-100'
                : 'bg-white dark:bg-gray-900/80 ring-gray-300/70 dark:ring-gray-700',
              'max-w-xs ring-1 rounded-3xl p-8 xl:p-10',
              tier.highlighted ? 'fancyGlassContrast' : '',
            ]"
          >
            <h3
              :id="tier.id"
              :class="[
                tier.featured
                  ? 'text-white dark:text-black'
                  : 'text-black dark:text-white',
                'text-2xl font-bold tracking-tight',
              ]"
            >
              {{ tier.name }}
            </h3>
            <p
              :class="[
                tier.featured
                  ? 'text-gray-300 dark:text-gray-500'
                  : 'text-gray-600 dark:text-gray-400',
                'mt-4 text-sm leading-6',
              ]"
            >
              {{ tier.description }}
            </p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span
                :class="[
                  tier.featured
                    ? 'text-white dark:text-black'
                    : 'text-black dark:text-white',
                  'text-4xl font-bold tracking-tight',
                ]"
              >
                {{
                  typeof tier.price === 'string'
                    ? tier.price
                    : tier.price[frequency.value]
                }}
              </span>

              <span
                v-if="
                  typeof tier.price !== 'string' && tier.price[1] !== 'Custom'
                "
                :class="[
                  tier.featured
                    ? 'text-gray-300 dark:text-gray-500'
                    : 'dark:text-gray-400 text-gray-600',
                  'text-sm font-semibold leading-6',
                ]"
              >
                {{ frequency.priceSuffix }}
              </span>
            </p>
            <a
              :href="tier.href"
              :aria-describedby="tier.id"
              :class="[
                'flex mt-6 shadow-sm',
                tier.soldOut ? 'pointer-events-none' : '',
              ]"
            >
              <button
                :disabled="tier.soldOut"
                :class="[
                  'w-full inline-flex items-center justify-center font-medium ring-offset-background hover:opacity-70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-black dark:text-white h-12 rounded-md px-6 sm:px-10 text-md',
                  tier.featured || tier.soldOut ? 'grayscale' : '',
                  !tier.highlighted && !tier.featured
                    ? 'bg-gray-100 dark:bg-gray-600 border border-solid border-gray-300 dark:border-gray-800'
                    : 'bg-slate-300/70 text-slate-foreground hover:bg-slate-400/70 dark:bg-slate-700 dark:hover:bg-slate-800/90',
                  tier.featured ? '!bg-gray-100 dark:!bg-black' : '',
                ]"
              >
                {{ tier.soldOut ? 'Sold out' : tier.cta }}
              </button>
            </a>

            <ul
              :class="[
                tier.featured
                  ? 'text-gray-300 dark:text-gray-500'
                  : 'text-gray-700 dark:text-gray-400',
                'mt-8 space-y-3 text-sm leading-6 xl:mt-10',
              ]"
            >
              <li
                v-for="feature in tier.features"
                :key="feature"
                class="flex gap-x-3"
              >
                <Icon
                  name="lets-icons:check-fill"
                  :class="[
                    tier.featured ? 'text-white dark:text-black' : '',
                    tier.highlighted ? 'text-slate-500' : 'text-gray-500',
                    'h-6 w-6 flex-none',
                  ]"
                  aria-hidden="true"
                />
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fancyOverlay,
.fancyGlass {
  --primary-light: theme('colors.slate.400');
  --primary-main: theme('colors.slate.500');
  --primary-darker: theme('colors.slate.900');
  --secondary-light: theme('colors.stone.400');
  --secondary-main: theme('colors.stone.500');
  --secondary-darker: theme('colors.stone.900');
  --glass-color: 120, 113, 108;
}

/**
  * Overlay gradients & animation - used as page background.
  */
@property --fancy-x {
  syntax: '<percentage>';
  inherits: true;
  initial-value: 0%;
}
@property --fancy-y {
  syntax: '<percentage>';
  inherits: true;
  initial-value: 0%;
}

@keyframes roundabout {
  0% {
    --fancy-x: 60%;
    --fancy-y: 20%;

    opacity: 0;
  }

  5% {
    --fancy-x: 80%;
    --fancy-y: 10%;
  }

  20% {
    --fancy-x: 95%;
    --fancy-y: 5%;

    opacity: var(--maximum-opacity);
  }

  100% {
    --fancy-x: 100%;
    --fancy-y: 0%;

    opacity: var(--maximum-opacity);
  }
}

.fancyOverlay::after {
  --maximum-opacity: 0.1;

  content: '';
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    54deg,
    var(--primary-light) var(--fancy-y) var(--fancy-y),
    var(--secondary-light) var(--fancy-x) var(--fancy-x)
  );
  animation: roundabout 10s ease-in-out both;
}

/**
  * Glass effect with a gradient background and blur - used for highlighting pricing cards.
  */
.fancyGlass,
.fancyGlassContrast {
  background:
    radial-gradient(
      63.94% 63.94% at 50% 0%,
      rgba(var(--glass-color), 0.12) 0%,
      rgba(var(--glass-color), 0) 100%
    ),
    rgba(var(--glass-color), 0.01);
  backdrop-filter: blur(6px);
  position: relative;
  overflow: hidden;
}

.fancyGlassContrast:after {
  content: '';
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  background: var(--primary-darker);
  opacity: 0.1;
  position: absolute;
  top: -1px;
  left: -1px;
  z-index: -1;
}

.fancyGlassContrast:before,
.fancyGlass:before {
  content: '';
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  background:
    linear-gradient(
      rgba(var(--glass-color), 0.12) 0%,
      rgba(var(--glass-color), 0) 74.04%
    ),
    linear-gradient(
      0deg,
      rgba(var(--glass-color), 0.04),
      rgba(var(--glass-color), 0.04)
    );
  position: absolute;
  top: -1px;
  left: -1px;
  mask: url("data:image/svg+xml,%3Csvg width='402' height='202' viewBox='0 0 402 202' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0.5' y='0.5' width='401' height='201' rx='9.5' /%3E%3C/svg%3E%0A");
  pointer-events: none;
}
</style>
