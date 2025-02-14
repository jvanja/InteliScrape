<template>
  <div class="py-16 text-center">
    <h1 class="text-7xl font-bold mb-8">Verity.ai</h1>
    <div class="container mx-auto px-4 py-8 space-y-32">
      <!-- Section 1: What the App Is -->
      <section class="text-center">
        <h2 class="text-3xl font-bold mb-8">What is Verity?</h2>
        <p class="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          Verity is a platform that extracts and organizes web-based information
          into coherent, reliable data. In an era of overwhelming online
          content, we help you cut through the clutter to obtain insights that
          are both accurate and dependable.
        </p>
        <ClientOnly>
          <SectionOne />
        </ClientOnly>
      </section>

      <!-- Section 2: How Does It Work? -->
      <section class="text-center">
        <h2 class="text-3xl font-bold mb-8">How Does It Work?</h2>
        <p class="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          Our process begins by intelligently isolating relevant content from
          raw web data. We then apply robust cleaning and processing methods to
          refine the output, ensuring the final data is structured and free of
          unnecessary noise.
        </p>
        <!-- a visual graphics showing a complex network (nodes and lines) on one side that gradually merge into a clean organized pattern on the other side. Background color should be a simple f3f4f6 with no gradients. 
The graphics should NOT contain any letters or symbols. -->
        <div class="flow flex gap-4 max-w-full">
          <img src="~/assets/img/noise.png" class="w-1/4" />
          <img src="~/assets/img/arrow.svg" alt="Discover Nuxt 3" />
          <img src="~/assets/img/noise.png" class="w-1/4" />
          <img src="~/assets/img/arrow.svg" alt="Discover Nuxt 3" />
          <img src="~/assets/img/noise.png" class="w-1/4" />
        </div>
      </section>

      <!-- Section 3: Ensuring Data Integrity -->
      <section class="text-center">
        <h2 class="text-3xl font-bold mb-8">Ensuring Data Integrity</h2>
        <p class="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          We place a strong emphasis on data integrity. Verity employs layered
          validation and comprehensive checks to confirm accuracy and
          consistency. This careful approach minimizes errors, delivering
          high-quality data you can rely on.
        </p>
        <img src="~/assets/img/section3.png" alt="Discover Nuxt 3" />
      </section>
    </div>
      <div v-if="!user" class="mt-6">
      Please
      <NuxtLink to="/login" class="text-purple-600 font-bold">log in</NuxtLink>
      to use the app.
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>
