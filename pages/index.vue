<template>
  <div class="container mx-auto p-4">
    <h1 class="text-5xl font-bold mb-4">
      Mini Smart <span class="text-primary-800">Scraper</span>
    </h1>
    <div class="">Please <NuxtLink to="/dashboard" class="text-primary-800 font-bold">log in</NuxtLink> to use the app.</div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser, navigateTo } from "#imports";

const user = useSupabaseUser();

if(user.value) {
  navigateTo("/dashboard");
}
</script>
<style scoped></style>
