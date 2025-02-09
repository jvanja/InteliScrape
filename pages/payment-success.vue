<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
    <h1 class="text-4xl font-bold mb-4 text-green-700">Payment Successful!</h1>
    <p class="text-lg text-gray-700 mb-8">
      Thank you for your payment. Your transaction has been successfully processed.
    </p>
    <NuxtLink
      to="/"
      class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
    >
      Return Home
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// No additional script logic is needed unless you want to retrieve and display session details.
</script>
