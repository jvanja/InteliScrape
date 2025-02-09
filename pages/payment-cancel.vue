<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
    <h1 class="text-4xl font-bold mb-4 text-red-700">Payment Cancelled</h1>
    <p class="text-lg text-gray-700 mb-8">
      Your payment was cancelled or could not be completed. Please try again.
    </p>
    <NuxtLink
      to="/"
      class="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Return Home
    </NuxtLink>
  </div>
</template>

