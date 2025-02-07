<template>
  <div class="mx-auto max-w-2xl py-16 text-center">
    <h1 class="text-7xl font-bold mb-8 bg-gradient-to-br from-violet-600 to-fuchsia-600">
      Mini <span class="text-purple-600">Smart</span> Scraper
    </h1>
    <p class="text-gray-700 text-lg">
      Mini Scraper is an AI-powered assistant for quick, clean data
      extraction. Provided a list of URLs and a prompt — Mini Scraper does the
      rest, scraping and structuring information into exactly what you need.
      It's fast, flexible, and keeps your AI costs low by filtering out the
      noise first.
    </p>
    <div class="mt-6">
      Please
      <NuxtLink to="/login" class="text-purple-600 font-bold"
        >log in</NuxtLink
      >
      to use the app.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser, navigateTo } from '#imports'

const user = useSupabaseUser()

if (user.value) {
  navigateTo('/dashboard')
}
</script>
<style scoped></style>
