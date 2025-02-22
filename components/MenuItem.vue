<template>
  <NuxtLink
    :to="item.to"
    class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    active-class="bg-gray-900 text-white"
    >{{ item.title }}</NuxtLink
  >
</template>

<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>
