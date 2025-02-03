<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="text-xl font-bold">
        <NuxtLink to="/">MiniScraper</NuxtLink>
      </div>
      <div v-if="user">
        <Button variant="secondary" @click="logout">Log Out</Button>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { useSupabaseUser, useSupabaseClient, navigateTo } from "#imports";

const user = useSupabaseUser()
const supabase = useSupabaseClient();

async function logout() {
  await supabase.auth.signOut();
  navigateTo("/login");
}
</script>
