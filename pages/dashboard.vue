<template>
  <div v-if="user" class="text-center">
    <h1 class="text-3xl font-semibold mb-10">
      Welcome, <span class="text-purple-600">{{ user.email }}</span
      >!
    </h1>
    <!-- List of previous queries -->
    <UserQueries v-if="!newQuery" />

    <!-- New query form -->
    <ScrapeForm v-else />

    <Button v-if="!newQuery" class="mt-8" @click="newQuery = true"
      >Create a New Query</Button
    >
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const user = useSupabaseUser()
const newQuery = ref(false)
</script>
