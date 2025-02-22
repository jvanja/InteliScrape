<template>
  <div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold">Our Pricing Plans</h1>
        <p class="mt-4 text-xl">
          Choose the plan that best fits your needs.
        </p>
      </div>
      <!-- Pricing Cards -->
      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Regular Plan -->
        <div
          class="flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200"
        >
          <div class="px-6 py-8 sm:p-10 sm:pb-6">
            <div class="flex items-baseline">
              <span class="text-4xl font-extrabold">$20</span>
              <span class="ml-1 text-xl font-semibold"
                >/month</span
              >
            </div>
            <h3 class="mt-4 text-2xl font-medium">Regular</h3>
            <p class="mt-2 text-base">
              Maximum 10 pages per batch and 1 batch per day.
            </p>
          </div>
          <div class="flex-1 px-6 pt-6 pb-8">
            <ul class="space-y-4">
              <li class="flex items-center gap-1">
                <Icon name="mdi:check-bold" style="color: #009629" />
                <span>10 pages per batch</span>
              </li>
              <li class="flex items-center gap-1">
                <Icon name="mdi:check-bold" style="color: #009629" />
                <span>1 batch per day</span>
              </li>
            </ul>
            <div class="mt-8">
              <button
                class="block w-full bg-blue-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-blue-700"
              >
                Choose Regular
              </button>
            </div>
          </div>
        </div>
        <!-- Pro Plan -->
        <div
          class="flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200"
        >
          <div class="px-6 py-8 sm:p-10 sm:pb-6">
            <div class="flex items-baseline">
              <span class="text-4xl font-extrabold">$50</span>
              <span class="ml-1 text-xl font-semibold">/month</span
              >
            </div>
            <h3 class="mt-4 text-2xl font-medium">Pro</h3>
            <p class="mt-2 text-base">
              Maximum 100 pages per batch and up to 10 batches per day.
            </p>
          </div>
          <div class="flex-1 px-6 pt-6 pb-8">
            <ul class="space-y-4">
              <li class="flex items-center gap-1">
                <Icon name="mdi:check-bold" style="color: #009629" />
                <span>100 pages per batch</span>
              </li>
              <li class="flex items-center gap-1">
                <Icon name="mdi:check-bold" style="color: #009629" />
                <span>10 batches per day</span>
              </li>
            </ul>
            <div class="mt-8">
              <button
                class="block w-full bg-blue-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-blue-700"
              >
                Choose Pro
              </button>
            </div>
          </div>
        </div>
        <!-- Custom Plan -->
        <div
          class="flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200"
        >
          <div class="px-6 py-8 sm:p-10 sm:pb-6">
            <div class="flex items-baseline">
              <span class="text-4xl font-extrabold">Enterprise</span>
            </div>
            <h3 class="mt-4 text-2xl font-medium">Custom</h3>
            <p class="mt-2 text-base">
              Tailored solutions for enterprise-level needs.
            </p>
          </div>
          <div class="flex-1 px-6 pt-6 pb-8">
            <ul class="space-y-4">
              <li class="flex items-center gap-1">
                <Icon name="mdi:check-bold" style="color: #009629" />
                <span>Flexible pages per batch</span>
              </li>
              <li class="flex items-center gap-1">
                <Icon name="mdi:check-bold" style="color: #009629" />
                <span>Custom batch limits & usage</span>
              </li>
            </ul>
            <div class="mt-8">
              <button
                class="block w-full bg-blue-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-blue-700"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
