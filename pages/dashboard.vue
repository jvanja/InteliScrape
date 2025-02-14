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

  <div v-else class="text-center mt-10">
    <p class="text-xl text-red-500">You are not logged in.</p>
    <p class="text-gray-700 mt-2">
      <a href="/login" class="text-blue-600 hover:underline"> Go to Login </a>
    </p>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const newQuery = ref(false)
</script>
